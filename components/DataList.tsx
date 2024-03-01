import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Container, Table, Pagination } from "react-bootstrap";

function DataList() {
  const [data, setData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [newRecord, setNewRecord] = useState({});
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  //   const [filteredData, setFilteredData] = useState([]); // New state for filtered data
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("ascending");
  const [activeFilter, setActiveFilter] = useState("");
  const [activeOrder, setActiveOrder] = useState("ascending"); // To track the active order

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    setActiveOrder(newOrder); // Update the active order state
  };

  const handleFilterChange = (newFilter) => {
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
        const formattedData = response.data.slice(1).map((row, index) => {
          const obj = {};
          response.data[0].forEach((header, idx) => {
            obj[header] = row[idx];
          });
          return { id: index, ...obj };
        });
        setData(formattedData);
        setFilteredData(formattedData); // Initialize filteredData with the same data
      })
      .catch((error) => console.error("Error fetching data: ", error));
  };
  const handleSort = () => {
    const sorted = [...data];
    if (dateFilter === "asc") {
      sorted.sort((a, b) => new Date(a["Date Added"]) - new Date(b.DateAdded));
    } else if (dateFilter === "desc") {
      sorted.sort(
        (a, b) => new Date(b["Date Added"]) - new Date(a["Date Added"])
      );
    }
    console.log(sorted);
    setData(sorted);
  };
  const handleEdit = (id) => {
    setEditRowId(id);
  };

  const handleRowChange = (e, id) => {
    const { name, value } = e.target;
    setData(
      data.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const handleDelete = (range) => {
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

  const handleSave = (id) => {
    const updatedRow = data.find((row) => row.id === id);
    const range = `Sheet1!A${id + 2}:L${id + 2}`;
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
  };

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddNewRecord = () => {
    const values = Object.values(newRecord);
    axios
      .post("https://pear-cocoon-hose.cyclic.app/add-row", { values })
      .then(() => {
        alert("New record added successfully");
        setNewRecord({}); // Reset new record form
        fetchData(); // Refresh the data list
      })
      .catch((error) => {
        alert("Error adding new record");
        console.error(error);
      });
  };
  const handleDateFilterChange = (e) => {
    const newFilter = e.target.value;
    setDateFilter(newFilter);
  };

  const handleSearch = (e) => {
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
  const currentData = data.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container
      className="shadow-lg pb-12 pl-4 pr-4"
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
          <Form.Group controlId="search">
            <Form.Label>Search:</Form.Label>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
        </div>
      </Container>
      <Table responsive="sm" bordered hover>
        <thead>
          <tr>
            {data[0] &&
              Object.keys(data[0])
                .filter((key) => key !== "id")
                .map((header) => <th key={header}>{header}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              {Object.keys(row)
                .filter((key) => key !== "id")
                .map((key) => (
                  <td key={key}>
                    {editRowId === row.id && key === "Referrals Status" ? (
                      <Form.Control
                        as="select"
                        name={key}
                        value={row[key]}
                        onChange={(e) => handleRowChange(e, row.id)}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Control>
                    ) : editRowId === row.id ? (
                      <Form.Control
                        type="text"
                        name={key}
                        value={row[key]}
                        onChange={(e) => handleRowChange(e, row.id)}
                      />
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}

              <td>
                {editRowId === row.id ? (
                  <button
                    style={{ background: "#fa7f5c" }}
                    className="text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleSave(row.id)}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      style={{ background: "#ff9c80" }}
                      className="text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleEdit(row.id)}
                    >
                      Edit
                    </button>
                    {/* <Button
                      variant="danger"
                      onClick={() =>
                        handleDelete(`Sheet1!A${row.id + 2}:L${row.id + 2}`)
                      }
                    >
                      Delete
                    </Button> */}
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            {data[0] &&
              Object.keys(data[0])
                .filter((key) => key !== "id")
                .map((header) => (
                  <td key={header + "-new"}>
                    {header === "Referrals Status" ? (
                      <Form.Control
                        as="select"
                        name={header}
                        value={newRecord[header] || ""}
                        onChange={handleNewRecordChange}
                      >
                        <option value="">Select Status</option>{" "}
                        {/* Provide a default "select" option */}
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Control>
                    ) : (
                      <Form.Control
                        type="text"
                        name={header}
                        value={newRecord[header] || ""}
                        onChange={handleNewRecordChange}
                      />
                    )}
                  </td>
                ))}

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
        {" "}
        {/* Center the pagination */}
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
}

export default DataList;
