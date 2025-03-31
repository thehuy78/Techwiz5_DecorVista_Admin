import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Radio, DatePicker, Space, message } from "antd";
import { Link } from "react-router-dom";
import axiosAdmin from "@/shared/api/axiosAdmin";
import { Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  margin: 2rem;
`;

export default function Order() {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [resultvalue, setresultvalue] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setstartPage] = useState(1);
  const [data, setData] = useState([]);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = resultvalue.slice(firstIndex, lastIndex);
  const pages = Math.ceil(resultvalue.length / recordsPerPage);

  var numbers = Array.from({ length: Math.min(5, pages) }, (_, i) => startPage + i);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 1 < startPage) {
        setstartPage(startPage - 1);
      }
    }
  };
  const NextPage = () => {
    if (currentPage !== pages) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 >= startPage + 5) {
        setstartPage(startPage + 1);
      }
    }
  };

  const firstpage = () => {
    setstartPage(1);
    setCurrentPage(1);
  };
  const lastpage = () => {
    setCurrentPage(pages);
    if (pages >= 5) {
      setstartPage(pages - 4);
    }
  };

  const changeCurrentPage = (id) => {
    setCurrentPage(id);
  };
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axiosAdmin.get("Order");
        console.log(response.data.data);
        console.log(response.data.data);
        const dataresponse = response.data.data;
        setresultvalue(dataresponse);
        setData(dataresponse);
        form.resetFields();
        form.setFieldsValue({
          Search: "",
          Status: "",
          Date_order: null,
          Month: moment(),
        });
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [form] = Form.useForm();
  const [month, setmonth] = useState(moment());
  const GetdataByMonth = async () => {
    var formvalue = form.getFieldsValue();
    console.log(formvalue);
    if (formvalue.Month === "") {
      return;
    }
    const Formdata = new FormData();

    Formdata.append("Month", formvalue.Month);
    try {
      const response = await axiosAdmin.post("Order/GetByMonth", Formdata);

      form.resetFields();
      form.setFieldsValue({
        Search: "",
        Status: "",
        Date_order: {},
        Month: formvalue.Month,
      });

      console.log(response.data.data);
      setresultvalue(response.data.data);
      setData(response.data.data);
    } catch (error) {
      if (error.response.data === "Invalid email") {
        navigate(`/error`);
      } else {
        message.error("Error: " + error);
      }
    } finally {
    }
  };
  const SelectMonth = (dates, dateStrings) => {
    form.setFieldsValue({
      Month: dateStrings,
    });
    setmonth(dates);
    setDisabledRange({
      start: moment(dateStrings).startOf("month"),
      end: moment(dateStrings).endOf("month"),
    });
    GetdataByMonth();
  };
  const handleSearch = () => {
    const formvalue = form.getFieldsValue();
    console.log(formvalue);
    var result = data.filter((e) => {
      const searchTerm = formvalue.Search.toLowerCase();
      return (
        e.customerName.toLowerCase().includes(searchTerm) ||
        e.id.toLowerCase().includes(searchTerm) ||
        e.contact_number.toLowerCase().includes(searchTerm)
      );
    });
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    if (formvalue.Date_order !== null) {
      result = result.filter((e) => {
        var newcreate_at = new Date(e.created_date).setHours(0, 0, 0, 0);
        var startDate = new Date(formvalue.Date_order[0]).setHours(0, 0, 0, 0);
        var endDate = new Date(formvalue.Date_order[1]).setHours(23, 59, 59, 999);
        console.log(startDate);
        console.log(newcreate_at);
        console.log(endDate);
        return startDate <= newcreate_at && endDate >= newcreate_at;
      });
    }

    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);
  };
  const [disabledRange, setDisabledRange] = useState({
    start: moment().startOf("month"),
    end: moment().endOf("month"),
  });
  const disabledDate = (current) => {
    // Disable dates outside the range
    return current < disabledRange.start || current > disabledRange.end;
  };
  const handleRangeChangeDate_order = (dates, dateStrings) => {
    console.log(dateStrings);

    if (dates !== null) {
      form.setFieldsValue({
        Date_order: [dateStrings[0], dateStrings[1]],
      });
    } else {
      form.setFieldsValue({
        Date_order: null,
      });
    }
    handleSearch();
  };
  const [loading, setLoading] = useState(false);
  const ChangeStatus = async (index) => {
    try {
      const response = await axiosAdmin.get("Order/ChangeStatus/" + index, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      resultvalue.forEach((e) => {
        if (e.id === index) {
          if (e.status === "packaged") {
            e.status = "delivery";
          } else {
            e.status = "completed";
          }
        }
      });
      setLoading(!loading);
      message.success("Change Status Success!");
    } catch (error) {
      message.error("Error: " + error);
    } finally {
      setwaiting(false);
    }
  };
  return (
    <Container>
      <div className="container bg-white p-5">
        <h2>List Order.</h2>
        <div className="option">
          <Form
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
            layout="vertical"
            form={form}
            className="form-option"
          >
            <Form.Item label="Month" name="Month">
              <Space direction="vertical">
                <DatePicker defaultValue={month} picker="month" onChange={SelectMonth} />
              </Space>
            </Form.Item>
            <Form.Item label=" " className="Search" name="Search">
              <Input placeholder="Customer, Order Id, Phone" onChange={handleSearch} />
            </Form.Item>
            <Form.Item label="Date Oreder." name="Date_order">
              <Space direction="vertical">
                <RangePicker
                  disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={handleRangeChangeDate_order}
                />
              </Space>
            </Form.Item>
            <Form.Item label=" " name="Status">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value="packaged">Packaged</Radio>
                <Radio value="delivery">Delivery</Radio>
                <Radio value="completed">Completed</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
        <div>
          <Table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((item, index) => (
                <tr key={index} style={{ height: "100%", backgroundColor: "yellow" }}>
                  <td>
                    {" "}
                    <Link to={`/order_detail?id=${item.id}`} style={{ textDecoration: "none" }}>
                      {item.id}
                    </Link>
                  </td>
                  <td>{item.customerName}</td>
                  <td>{item.contact_number}</td>
                  <td>{item.address}</td>
                  <td>{item.total}</td>
                  <td>{moment(item.created_date).format("DD/MM/YYYY HH:mm")}</td>
                  <td>
                    <Button
                      className={`btn ${
                        item.status === "delivery"
                          ? "btn-primary"
                          : item.status === "completed"
                          ? "btn-success"
                          : "btn-danger"
                      } `}
                      disabled={
                        item.status === "packaged" || item.status === "delivery" ? false : true
                      }
                      onClick={() => ChangeStatus(item.id)}
                    >
                      {item.status === "delivery"
                        ? "Delivery"
                        : item.status === "completed"
                        ? "Completed"
                        : item.status.toLowerCase() === "finished"
                        ? "Packaged"
                        : item.status}
                    </Button>
                    <Button
                      className="mx-1"
                      onClick={() => navigate(`/order_detail?id=${item.id}`)}
                    >
                      Detail
                    </Button>
                  </td>
                  {/* <td>
            {item.status !== undefined
              ? item.status === true
                ? "Active"
                : "Disable"
              : item.Status
              ? "Active"
              : "Disable"}
          </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <Link href="#" className="page-link" onClick={firstpage}>
                  First Page.
                </Link>
              </li>
              <li className="page-item">
                <Link href="#" className="page-link" onClick={prePage}>
                  Prev
                </Link>
              </li>
              {numbers.map((n, i) => (
                <li className={`page-item ${currentPage === n ? "active" : ""}`} key={i}>
                  <Link href="#" className="page-link" onClick={() => changeCurrentPage(n)}>
                    {n}
                  </Link>
                </li>
              ))}
              <li className="page-item">
                <Link href="#" className="page-link" onClick={NextPage}>
                  Next
                </Link>
              </li>
              <li className="page-item">
                <Link href="#" className="page-link" onClick={lastpage}>
                  Last Page.
                </Link>
              </li>
              <li className="page-item">
                <p className="page-link">{currentPage + "/" + pages}</p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Container>
  );
}
