import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Radio, DatePicker, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Table } from "react-bootstrap";
import axiosAdmin from "@/shared/api/axiosAdmin";
import styled from "styled-components";

const Container = styled.div`
  margin: 2rem;
  padding: 1rem;
  background-color: white;
`;

export default function OrderDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
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
  const getFirebaseImageUrl = (fileName) => {
    const url = `https://firebasestorage.googleapis.com/v0/b/techwizwebapp.appspot.com/o/Images%2F${fileName}?alt=media&token=96ce3d26-1f12-40cf-a9d0-e355b0f238f7`;
    return url;
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axiosAdmin.get("OrderDetail/GetByOrderId/" + id);
        console.log(response.data.data);
        console.log(response.data.data);
        const dataresponse = response.data.data;
        setresultvalue(dataresponse);
        setData(dataresponse);
      } catch (error) {
        message.error("Error: " + error);
      } finally {
      }
    };
    fetchdata();
  }, []);

  return (
    <Container>
      <div className="container" style={{ marginTop: "3%" }}>
        <h2>Order {id}.</h2>

        <div>
          <Table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Color</th>
                <th>Size</th>
                <th>Material</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((item, index) => (
                <tr key={index} style={{ height: "100%", backgroundColor: "yellow" }}>
                  <td>{item.product}</td>
                  <td>
                    <img
                      style={{ height: "80px", width: "80px" }}
                      src={getFirebaseImageUrl(item.image)}
                      alt="img"
                    />
                  </td>

                  <td>
                    {" "}
                    {item.type
                      .filter((e) => e.attributetype == "Color")
                      .map((filteredItem) => (
                        <div key={filteredItem.id}>{filteredItem.attributevalue}</div>
                      ))}
                  </td>
                  <td>
                    {" "}
                    {item.type
                      .filter((e) => e.attributetype == "Size")
                      .map((filteredItem) => (
                        <div key={filteredItem.id}>{filteredItem.attributevalue}</div>
                      ))}
                  </td>
                  <td>
                    {" "}
                    {item.type
                      .filter((e) => e.attributetype == "Material")
                      .map((filteredItem) => (
                        <div key={filteredItem.id}>{filteredItem.attributevalue}</div>
                      ))}
                  </td>
                  <td>{item.price}</td>
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
