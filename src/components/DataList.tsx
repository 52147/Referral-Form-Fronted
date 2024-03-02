import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import {
  Form,
  Container,
  Table,
  Pagination,
  Modal,
  Button,
} from "react-bootstrap";
import "./DataList.css";

// Define an interface for the structure of a row in your data
interface DataRow {
  id: number;
  // Add other fields according to your data structure
  [key: string]: any; // Use this if your data structure includes dynamic keys
}
interface RecordType {
  id?: number;
  // other fields, all optional
  [key: string]: any; // or more specific types if applicable
}

function DataList() {
  const [data, setData] = useState<DataRow[]>([]);
  const [editRowId, setEditRowId] = useState(null);
  // const [newRecord, setNewRecord] = useState<RecordType>({
  //   id: -1,
  //   Name: "",
  //   status: "Active",
  // });
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("ascending");
  const [activeFilter, setActiveFilter] = useState("");
  const [activeOrder, setActiveOrder] = useState("ascending"); // To track the active order
  const [show, setShow] = useState(false);
  const initialFormState = {
    name: "",
    phoneNumber: "",
    emailAddress: "",
    companyName: "",
    currentPositionTitle: "",
    positionYouCanProvideReferral: "",
    candidateVisaRequirements: "",
    candidateWorkAuthorization: "",
    additionalInformationRequired: "",
    expectedTimeToRespond: "",
    dateAdded: "",
    referralsStatus: "", // Keep only if this field is required
    // Do not include 'status' or 'Name' if they are not required
  };

  // Initialize your newRecord state with the initialFormState
  const [newRecord, setNewRecord] = useState(initialFormState);
  useEffect(() => {
    console.log("New record state updated:", newRecord);
  }, [newRecord]);

  // Function to toggle the modal
  const handleClose = () => setShow(false);

  const handleOrderChange = (newOrder: string) => {
    setOrder(newOrder);
    setActiveOrder(newOrder); // Update the active order state
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setActiveFilter(newFilter); // Update the active filter state
  };
  useEffect(() => {
    fetchData();
  }, []); // The empty array ensures this effect runs once after the initial render

  useEffect(() => {
    // applySearchFilter();
  }, [data, searchTerm]); // Update filtered data when data or search term changes

  useEffect(() => {
    handleSort();
  }, [dateFilter]);

  const fetchData = () => {
    axios
      .get(`https://pear-cocoon-hose.cyclic.app/data`)
      .then((response) => {
        // Assuming the response data is an array of arrays
        const headers = response.data[0] as string[]; // The first row is headers
        const rows = response.data.slice(1) as any[][]; // The rest are data rows

        const formattedData: DataRow[] = rows.map((row, index) => {
          const obj: DataRow = { id: index }; // Initialize with id
          headers.forEach((header, idx) => {
            obj[header] = row[idx];
          });
          return obj;
        });

        setData(formattedData);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  };
  useEffect(() => {
    fetchData();
  }, []); // The empty array ensures this effect runs once after the initial render

  const handleSort = () => {
    const sorted = [...data];
    if (dateFilter === "asc") {
      sorted.sort(
        (a, b) =>
          new Date(a["Date Added"]).getTime() -
          new Date(b["Date Added"]).getTime()
      );
    } else if (dateFilter === "desc") {
      sorted.sort(
        (a, b) =>
          new Date(b["Date Added"]).getTime() -
          new Date(a["Date Added"]).getTime()
      );
    }
    console.log(sorted);
    setData(sorted);
  };
  useEffect(() => {
    handleSort();
  }, [handleSort]); // Add handleSort to the dependency array
  const handleEdit = (id: any) => {
    setEditRowId(id);
  };

  const handleRowChange = (e: any, id: number) => {
    const { name, value } = e.target;
    const newData = data.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setData(newData); // Update the data state with the modified row
  };

  const handleDelete = (range: any) => {
    axios
      .post("https://pear-cocoon-hose.cyclic.app/clear-values", { range })
      .then(() => {
        alert("Row deleted successfully");
        fetchData(); // Refresh the data list
      })
      .catch((error) => {
        alert("Error deleting row");
        console.error(error);
      });
  };

  const handleSave = (id: number) => {
    const updatedRow = data.find((row) => row.id === id);
    const range = `Sheet1!A${id + 2}:L${id + 2}`;
    if (updatedRow) {
      const values = Object.values(updatedRow).slice(1);
      const payload = {
        range: range,
        values: values,
      };

      axios
        .post("https://pear-cocoon-hose.cyclic.app/update-values", payload)
        .then(() => {
          alert("Row updated successfully");
          setEditRowId(null); // Exit edit mode
          fetchData(); // Refresh the data list
        })
        .catch((error) => {
          alert("Error updating row");
          console.error(error);
        });
    } else {
      console.error("Updated row not found");
    }
  };
  const handleNewRecordChange = (e: ChangeEvent<any>) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewRecord = () => {
    console.log(newRecord);
    // Check if all necessary data is input
    if (Object.values(newRecord).some((value) => value === "")) {
      // If not all data is input, show modal
      setShow(true); // show warning modal
    } else {
      const values = Object.values(newRecord);
      const initialValues = {
        name: "",
        phoneNumber: "",
        emailAddress: "",
        companyName: "",
        currentPositionTitle: "",
        positionYouCanProvideReferral: "",
        candidateVisaRequirements: "",
        candidateWorkAuthorization: "",
        additionalInformationRequired: "",
        expectedTimeToRespond: "",
        dateAdded: "",
        referralsStatus: "",
      };
      axios
        .post("https://pear-cocoon-hose.cyclic.app/add-row", { values })
        .then(() => {
          alert("New record added successfully");
          setNewRecord(initialValues); // Reset new record form to initial values

          fetchData(); // Refresh the data list
        })
        .catch((error) => {
          alert("Error adding new record");
          console.error(error);
        });
    }
  };
  const handleDateFilterChange = (e: any) => {
    const newFilter = e.target.value;
    setDateFilter(newFilter);
  };

  const handleSearch = (e: any) => {
    const keyword = e.target.value.toLowerCase(); // Get the keyword entered by the user and convert it to lowercase
    setSearchTerm(keyword); // Update the search term state
    // Update the search query state based on the keyword
    setSearchQuery(keyword);
  };

  // Filtering and sorting logic
  const filteredData = data
    .filter(
      (item) => filter === "all" || item["Current Position/Title"] === filter
    )
    .filter((item) =>
      Object.values(item).some(
        (val) =>
          val &&
          typeof val === "string" &&
          val.toLowerCase().includes(searchTerm)
      )
    )
    .sort((a, b) => {
      const dateA = a["Date Added"]?.toString() || ""; // Convert to string with a fallback
      const dateB = b["Date Added"]?.toString() || ""; // Convert to string with a fallback

      if (order === "ascending") {
        return dateA.localeCompare(dateB);
      } else {
        return dateB.localeCompare(dateA);
      }
    });

  const handleRemoveAllFilters = () => {
    // Reset the filter to show all items
    setFilter("all"); // Assuming 'all' is the value used to display all items
    setActiveFilter("all"); // Also reset the active filter indicator to 'all'
    setActiveOrder(""); // Reset the active order if needed
    // ... reset other states related to filtering or sorting if they exist
  };
  const styles = {
    headFont: {
      fontSize: "3em", // Makes the font significantly larger
      fontWeight: "bold", // Makes the font bold
      background:
        "linear-gradient(to right bottom, #d73609, #fc9553, #d05e9e, #a80f6a)", // Applies a gradient
      WebkitBackgroundClip: "text", // Clips the background to the text
      color: "transparent", // Makes the text color transparent to show the background
      display: "inline-block", // Changes display to inline-block to properly apply the gradient
      WebkitTextFillColor: "transparent", // Ensures text fill color is transparent (for webkit browsers)
      MozBackgroundClip: "text", // For Firefox
      backgroundClip: "text", // Standard property
    },
  };
  // Pagination logic
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(firstIndex, lastIndex);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const normalizedPage = Math.min(Math.max(currentPage, 1), totalPages);
  // // Handle edge cases
  // if (totalPages <= 0) {
  //   return <div>No data to display</div>;
  // }

  return (
    <Container
      className="shadow-lg pb-12 pl-4 pr-4 "
      style={{
        borderRadius: "50px",
        borderWidth: "100",
        borderStyle: "none",
        width: "3000px",
      }}
    >
      <Container className="mb-12 " style={{ marginTop: 10 }}>
        <h1 style={styles.headFont} className="pt-12">
          United Proud Women Referral List
        </h1>
        <div className="filters">
          <Form.Group controlId="dateFilter" className="mt-4 ">
            {/* Order Buttons */}
            <button
              onClick={() => handleOrderChange("ascending")}
              className={`px-4 py-2 rounded-md transition-colors duration-200 mr-4 ${
                activeOrder === "ascending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Ascending
            </button>
            <button
              onClick={() => handleOrderChange("descending")}
              className={`px-4 py-2 rounded-md transition-colors duration-200 mr-4 ${
                activeOrder === "descending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Descending
            </button>

            {/* Filter Buttons */}
            <button
              onClick={() => handleFilterChange("Software Engineer")}
              className={`px-4 py-2 rounded-md transition-colors duration-200 mr-4 ${
                activeFilter === "Software Engineer"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Software Engineer
            </button>
            {/* Button to remove all filters */}
            <button
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeFilter === "Remove All Filters"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleRemoveAllFilters()}
            >
              Remove All Filters
            </button>
          </Form.Group>
          <Form.Group controlId="search" className="mt-4">
            <div className="d-flex align-items-center">
              <Form.Label className="pt-2 pr-4">Search:</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  className="btn btn-secondary ml-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              )}
            </div>
          </Form.Group>
        </div>
      </Container>
      <Table responsive="sm" bordered hover>
        <thead>
          <tr>
            {/* Assuming these are your headers based on the fields provided */}
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>Company Name</th>
            <th>Current Position/Title</th>
            <th>Position you can provide referral</th>
            <th>Candidate Visa Requirements</th>
            <th>Candidate's Work Authorization</th>
            <th>Additional Information Required</th>
            <th>Expected Time to Respond</th>
            <th>Date Added</th>
            <th>Referrals Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((row) => (
            <tr key={row.id}>
              {Object.keys(row)
                .filter((key) => key !== "id")
                .map((key) => (
                  <td key={key}>
                    {editRowId === row.id ? (
                      key === "Referrals Status" ? (
                        // This field remains a dropdown in edit mode
                        <Form.Control
                          as="select"
                          name={key}
                          value={row[key]}
                          onChange={(e) => handleRowChange(e, row.id)}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Form.Control>
                      ) : (
                        // Other fields become text inputs in edit mode
                        <Form.Control
                          type="text"
                          name={key}
                          value={row[key]}
                          onChange={(e) => handleRowChange(e, row.id)}
                        />
                      )
                    ) : key === "Referrals Status" ? (
                      // Display the text value of the dropdown when not in edit mode
                      row[key]
                    ) : (
                      // Display the text value for other fields
                      row[key]
                    )}
                  </td>
                ))}
              <td>
                {editRowId === row.id ? (
                  <button
                    className="text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleSave(row.id)}
                    style={{ background: "#fa7f5c" }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEdit(row.id)}
                    style={{ background: "#ff9c80" }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}

          {/* Row for adding a new record */}
          <tr>
            <td>
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleNewRecordChange}
                value={newRecord.name}
              />
            </td>
            <td>
              <Form.Control
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleNewRecordChange}
                value={newRecord.phoneNumber}
              />
            </td>
            <td>
              <Form.Control
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                onChange={handleNewRecordChange}
                value={newRecord.emailAddress}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="companyName"
                placeholder="Company Name"
                onChange={handleNewRecordChange}
                value={newRecord.companyName}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="currentPositionTitle"
                placeholder="Current Position/Title"
                onChange={handleNewRecordChange}
                value={newRecord.currentPositionTitle}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="positionYouCanProvideReferral"
                placeholder="Position You Can Provide Referral"
                onChange={handleNewRecordChange}
                value={newRecord.positionYouCanProvideReferral}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="candidateVisaRequirements"
                placeholder="Candidate Visa Requirements"
                onChange={handleNewRecordChange}
                value={newRecord.candidateVisaRequirements}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="candidateWorkAuthorization"
                placeholder="Candidate's Work Authorization"
                onChange={handleNewRecordChange}
                value={newRecord.candidateWorkAuthorization}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="additionalInformationRequired"
                placeholder="Additional Information Required"
                onChange={handleNewRecordChange}
                value={newRecord.additionalInformationRequired}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="expectedTimeToRespond"
                placeholder="Expected Time to Respond"
                onChange={handleNewRecordChange}
                value={newRecord.expectedTimeToRespond}
              />
            </td>
            <td>
              <Form.Control
                type="date"
                name="dateAdded"
                placeholder="Date Added"
                onChange={handleNewRecordChange}
                value={newRecord.dateAdded}
              />
            </td>
            <td>
              <Form.Control
                as="select"
                name="referralsStatus"
                onChange={handleNewRecordChange}
                value={newRecord.referralsStatus}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
            </td>
            <td>
              <button
                className="hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddNewRecord}
                style={{ background: "#e495c1" }}
              >
                Add New Record
              </button>
            </td>
          </tr>
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === normalizedPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Missing Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please input all required data before adding a new record.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="close-button"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DataList;
