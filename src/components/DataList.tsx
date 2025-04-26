import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Select, { MultiValue } from "react-select";
import {
  Form,
  Container,
  Table,
  Pagination,
  Modal,
  Card,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./DataList.css";

interface DataRow {
  id: number;
  [key: string]: any;
}

interface OptionType {
  value: string;
  label: string;
}

interface RecordType {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  companyName: string;
  currentPositionTitle: string;
  positionYouCanProvideReferral: string;
  provideSponsorship: string;
  candidateVisaRequirements: string;
  additionalInformationRequired: string;
  expectedTimeToRespond: string;
  dateAdded: string;
  referralsStatus: string;
}

export default function DataList() {
  const [data, setData] = useState<DataRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSponsorship, setSelectedSponsorship] = useState<
    MultiValue<OptionType>
  >([]);
  const [selectedVisaReq, setSelectedVisaReq] = useState<
    MultiValue<OptionType>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isMobile, setIsMobile] = useState(false);
  const [openRow, setOpenRow] = useState<number | null>(null);

  const initialNew: RecordType = {
    name: "",
    phoneNumber: "",
    emailAddress: "",
    companyName: "",
    currentPositionTitle: "",
    positionYouCanProvideReferral: "",
    provideSponsorship: "",
    candidateVisaRequirements: "",
    additionalInformationRequired: "",
    expectedTimeToRespond: "",
    dateAdded: "",
    referralsStatus: "Active",
  };
  const [newRecord, setNewRecord] = useState<RecordType>(initialNew);

  const sponsorshipOptions: OptionType[] = [
    { value: "h1b", label: "H-1B" },
    { value: "opt", label: "OPT" },
    { value: "greencard", label: "Green Card" },
    { value: "f1", label: "F1" },
  ];
  const visaOptions: OptionType[] = [
    { value: "opt", label: "OPT" },
    { value: "h1b", label: "H-1B" },
    { value: "greencard", label: "Green Card" },
    { value: "cpt", label: "CPT" },
    { value: "j1", label: "J-1" },
    { value: "c9", label: "C-9" },
    { value: "f1", label: "F-1" },
    { value: "h4", label: "H-4" },
    { value: "l1", label: "L-1" },
  ];

  const primaryCols = [
    "Name",
    "Phone Number",
    "Date Added",
    "Referrals Status",
  ];
  const secondaryCols = [
    "Email Address",
    "Company Name",
    "Current Position/Title",
    "Position you can provide referral",
    "Provide Sponsorship",
    "Candidate's Visa Requirements",
    "Additional Information Required",
    "Expected Time to Respond",
  ];

  // 拉后端数据
  useEffect(() => {
    axios
      .get("https://referral-form-backend.onrender.com/data")
      .then((res) => {
        const headers = res.data[0] as string[];
        const rows = res.data.slice(1) as any[][];
        const formatted = rows.map((r, i) => {
          const obj: DataRow = { id: i };
          headers.forEach((h, idx) => (obj[h] = r[idx]));
          return obj;
        });
        setData(formatted);
      })
      .catch(console.error);
  }, []);

  // 监听屏宽
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const normalize = (s = "") => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  // 过滤逻辑
  const filtered = data.filter((row) => {
    if (
      searchTerm &&
      !Object.values(row).join(" ").toLowerCase().includes(searchTerm)
    )
      return false;

    if (
      selectedSponsorship.length &&
      !selectedSponsorship.every((opt) =>
        normalize(row["Provide Sponsorship"]).includes(opt.value)
      )
    )
      return false;

    if (
      selectedVisaReq.length &&
      !selectedVisaReq.every((opt) =>
        normalize(row["Candidate's Visa Requirements"]).includes(opt.value)
      )
    )
      return false;

    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 控件 handlers
  const handleSearchChange = (e: ChangeEvent<any>) =>
    setSearchTerm(e.target.value.trim().toLowerCase());
  const handleNewChange = (e: ChangeEvent<any>) =>
    setNewRecord((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClear = () => {
    setSearchTerm("");
    setSelectedSponsorship([]);
    setSelectedVisaReq([]);
    setCurrentPage(1);
  };
  const handleAdd = () => {
    const missing = Object.entries(newRecord).filter(
      ([k, v]) => k !== "referralsStatus" && v === ""
    );
    if (missing.length) {
      setShowError(true);
      return;
    }
    axios
      .post("https://referral-form-backend.onrender.com/add-row", {
        values: Object.values(newRecord),
      })
      .then(() => {
        setNewRecord(initialNew);
        setShowModal(false);
        setShowSuccess(true);
        setTimeout(() => window.location.reload(), 600);
      })
      .catch(console.error);
  };

  return (
    <Container className="mt-4">
      {/* Toast 提示 */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showSuccess}
          bg="success"
          autohide
          delay={2000}
          onClose={() => setShowSuccess(false)}
        >
          <Toast.Body className="text-white">
            Record added successfully
          </Toast.Body>
        </Toast>
        <Toast
          show={showError}
          bg="warning"
          autohide
          delay={3000}
          onClose={() => setShowError(false)}
        >
          <Toast.Body className="text-dark">
            Please fill out all fields
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <h1
        className="text-center text-5xl font-bold mb-12 mt-12"
        style={{
          background:
            "linear-gradient(to right bottom, #d73609, #fc9553, #d05e9e, #a80f6a)", // Applies a gradient background
          WebkitBackgroundClip: "text", // Clips the background to the text
          WebkitTextFillColor: "transparent", // Makes the text color transparent to show the gradient
        }}
      >
        United Proud Women Referral List
      </h1>

      {/* 过滤区 */}
      <Row className="mb-4 align-items-end">
        <Col md>
          <Form.Label>Search</Form.Label>
          <Form.Control
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md>
          <Form.Label>Sponsorship</Form.Label>
          <Select
            instanceId="sponsorship-select"
            isMulti
            options={sponsorshipOptions}
            value={selectedSponsorship}
            onChange={(o) =>
              setSelectedSponsorship(o as MultiValue<OptionType>)
            }
            placeholder="Select sponsorship..."
          />
        </Col>
        <Col md>
          <Form.Label>Visa Requirements</Form.Label>
          <Select
            instanceId="visa-select"
            isMulti
            options={visaOptions}
            value={selectedVisaReq}
            onChange={(o) => setSelectedVisaReq(o as MultiValue<OptionType>)}
            placeholder="Select visa requirements..."
          />
        </Col>
        <Col md="auto" className="d-flex gap-2 mt-3">
          <button className="custom-btn" onClick={() => setShowModal(true)}>
            Add New Record
          </button>
          <button className="custom-btn no-hover" onClick={handleClear}>
            Clear Filters
          </button>
        </Col>
      </Row>

      {/* 手机视图：手动条件渲染 */}
      {isMobile ? (
        currentData.map((row) => (
          <Card key={row.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                {row["Name"]} — {row["Date Added"]} — {row["Referrals Status"]}
              </Card.Title>
              <button
                className="custom-btn"
                onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
              >
                {openRow === row.id ? "Hide" : "Show"}
              </button>
              {openRow === row.id && (
                <div className="mt-2">
                  {primaryCols.concat(secondaryCols).map((col) => (
                    <div key={col} className="mb-2">
                      <strong>{col}:</strong> {row[col]}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        // 桌面视图：普通表格
        <Table responsive bordered hover>
          <thead>
            <tr>
              {primaryCols.concat(secondaryCols).map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id}>
                {primaryCols.concat(secondaryCols).map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 分页 */}
      <Pagination className="justify-content-center mb-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* 新增弹窗 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {Object.keys(initialNew)
                .filter((f) => f !== "referralsStatus")
                .map((field) => (
                  <Col md={6} className="mb-3" key={field}>
                    <Form.Group controlId={`new-${field}`}>
                      <Form.Label>
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </Form.Label>
                      <Form.Control
                        name={field}
                        value={(newRecord as any)[field]}
                        onChange={handleNewChange}
                        type={
                          field === "emailAddress"
                            ? "email"
                            : field === "dateAdded"
                            ? "date"
                            : "text"
                        }
                      />
                    </Form.Group>
                  </Col>
                ))}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="custom-btn no-hover"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className="custom-btn" onClick={handleAdd}>
            Add Record
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
