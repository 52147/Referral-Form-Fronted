import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Select, { MultiValue } from "react-select";
import {
  Form,
  Container,
  Table,
  Pagination,
  Modal,
  Collapse,
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

function DataList() {
  // 数据列表
  const [data, setData] = useState<DataRow[]>([]);
  // 新增弹窗显隐
  const [showModal, setShowModal] = useState(false);
  // Toast 控制
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // 新纪录模板
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

  // 过滤/搜索/分页
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSponsorship, setSelectedSponsorship] = useState<
    MultiValue<OptionType>
  >([]);
  const [selectedVisaReq, setSelectedVisaReq] = useState<
    MultiValue<OptionType>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 响应式展开
  const [isMobile, setIsMobile] = useState(false);
  const [openRow, setOpenRow] = useState<number | null>(null);

  // 多选选项
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

  // 表头列
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

  // 获取后端数据
  const fetchData = () => {
    axios
      .get("https://referral-form-backend.onrender.com/data")
      .then((response) => {
        const headers = response.data[0] as string[];
        const rows = response.data.slice(1) as any[][];
        const formatted = rows.map((row, idx) => {
          const obj: DataRow = { id: idx };
          headers.forEach((h, i) => (obj[h] = row[i]));
          return obj;
        });
        setData(formatted);
      })
      .catch(console.error);
  };
  useEffect(fetchData, []);

  // 响应式监听
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 辅助：归一化文本（无视空格/符号/大小写）
  const normalize = (s = "") => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  // 过滤逻辑
  const filtered = data.filter((row) => {
    // 全局搜索
    if (searchTerm) {
      const allText = Object.values(row).join(" ").toLowerCase();
      if (!allText.includes(searchTerm)) return false;
    }
    // Sponsorship 多选
    if (selectedSponsorship.length) {
      const fieldVal = normalize(row["Provide Sponsorship"]);
      if (!selectedSponsorship.every((opt) => fieldVal.includes(opt.value)))
        return false;
    }
    // Visa Requirements 多选
    if (selectedVisaReq.length) {
      const fieldVal = normalize(row["Candidate's Visa Requirements"]);
      if (!selectedVisaReq.every((opt) => fieldVal.includes(opt.value)))
        return false;
    }
    return true;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 处理各类交互
  const handleSearchChange = (e: ChangeEvent<any>) =>
    setSearchTerm(e.target.value.trim().toLowerCase());
  const handleNewChange = (e: ChangeEvent<any>) =>
    setNewRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleToggle = (idx: number) =>
    setOpenRow(openRow === idx ? null : idx);

  // 清除所有过滤器
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSponsorship([]);
    setSelectedVisaReq([]);
    setCurrentPage(1);
  };

  // 添加新纪录
  const handleAdd = () => {
    // 检查必填
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
        fetchData();
      })
      .catch(console.error);
  };
  const styles = {
    headFont: {
      fontWeight: "bold", // Makes the font bold
      background:
        "linear-gradient(to right bottom, #d73609, #fc9553, #d05e9e, #a80f6a)", // Applies a gradient
      WebkitBackgroundClip: "text", // Clips the background to the text
      color: "transparent", // Makes the text color transparent to show the background
      WebkitTextFillColor: "transparent", // Ensures text fill color is transparent (for webkit browsers)
      MozBackgroundClip: "text", // For Firefox
      backgroundClip: "text", // Standard property
    },
  };
  return (
    <Container className="mt-4">
      <h1
        style={styles.headFont}
        className="pt-12 pb-12 text-center flex justify-center text-5xl"
      >
        United Proud Women Referral List
      </h1>{" "}
      {/* 全局 Toast 提示 */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowSuccess(false)}
          show={showSuccess}
          bg="success"
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">
            Record added successfully
          </Toast.Body>
        </Toast>
        <Toast
          onClose={() => setShowError(false)}
          show={showError}
          bg="warning"
          delay={3000}
          autohide
        >
          <Toast.Body className="text-dark">
            Please fill out all the fields
          </Toast.Body>
        </Toast>
      </ToastContainer>
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
            isMulti
            options={sponsorshipOptions}
            value={selectedSponsorship}
            onChange={(opts) =>
              setSelectedSponsorship(opts as MultiValue<OptionType>)
            }
            placeholder="Select sponsorship..."
          />
        </Col>
        <Col md>
          <Form.Label>Visa Requirements</Form.Label>
          <Select
            isMulti
            options={visaOptions}
            value={selectedVisaReq}
            onChange={(opts) =>
              setSelectedVisaReq(opts as MultiValue<OptionType>)
            }
            placeholder="Select visa requirements..."
          />
        </Col>
        <Col md="auto" className="d-flex gap-2 mt-3">
          <button
            type="button"
            className="custom-btn"
            onClick={() => setShowModal(true)}
          >
            Add New Record
          </button>
          <button
            type="button"
            className="custom-btn no-hover"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </Col>
      </Row>
      {/* 数据展示 */}
      {isMobile ? (
        currentData.map((row, idx) => (
          <Card key={row.id} className="mb-3">
            <Card.Body>
              <Card.Title>{row["Name"]}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {row["Date Added"]} — {row["Referrals Status"]}
              </Card.Subtitle>
              <button className="custom-btn" onClick={() => handleToggle(idx)}>
                {openRow === idx ? "Hide" : "Show"}
              </button>
              <Collapse in={openRow === idx}>
                <div className="mt-2">
                  {primaryCols.concat(secondaryCols).map((col) => (
                    <div key={col}>
                      <strong>{col}:</strong> {row[col]}
                    </div>
                  ))}
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        ))
      ) : (
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
      {/* 分页 */}
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
            type="button"
            className="custom-btn no-hover"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button type="button" className="custom-btn" onClick={handleAdd}>
            Add Record
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DataList;
