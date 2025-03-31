import { useState } from "react";
import styled from "styled-components";
import { getProductListRequest } from "./api/productListApi";
import Pagination from "@/shared/components/Pagination/pagination";
import Button2 from "@/shared/components/Button/Button2";
import Button1 from "@/shared/components/Button/Button1";
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";
import Avatar from "react-avatar";
import TextInput from "@/shared/components/Input/TextInput";
import brandOptions from "../product/data/optionsBrand";
import optionsFunction from "../product/data/optionsFunction";
import SelectReact from "react-select";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { changeProductStatusRequest } from "./api/productListApi";
import ConfirmPopUp from "@/shared/components/PopUp/ConfirmPopUp";
import getWords from "@/shared/utils/getWords";
import SelectInput from "@/shared/components/Input/SelectInput";
import { adminRequest } from "@/shared/api/adminApi";
import { Link } from "react-router-dom";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  min-height: 80vh;
`;

const WaitingContainer = styled.div`
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: 5rem;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;
  overflow: hidden;

  thead tr {
    /* background-color: #0091ea; */
    /* color: #ffffff; */
    border-bottom: 3px solid #eeeff4;
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;

const EmailColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & span:nth-of-type(1) {
      font-weight: 500;
    }

    & span:nth-of-type(2) {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const Active = styled.span`
  &::before {
    background-color: red;
    border-color: #78d965;
    box-shadow: 0px 0px 6px 1.5px #94e185;
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    border: 1px solid #000;
    border-radius: 10px;
  }
`;

const Deactive = styled.span`
  &::before {
    background-color: #ffc182;
    border-color: #ffb161;
    box-shadow: 0px 0px 6px 1.5px #ffc182;
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    border: 1px solid #000;
    border-radius: 10px;
  }
`;

const PermissionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  > div {
    display: flex;
    gap: 1rem;
    /* margin: 10px 0; */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomButton2 = styled(Button2)`
  width: 80px;
`;

const ProductColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & span:nth-of-type(1) {
      font-weight: 500;
    }

    & span:nth-of-type(2) {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const FilterBox = styled.div`
  position: relative;
  > button {
    width: max-content;
  }
`;

const FilterDropDown = styled.div`
  margin-top: 5px;
  background-color: white;
  position: absolute;
  width: 200%;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 1rem;

  h5 {
    font-size: 16px;
  }

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & .active_filter {
    display: flex;
    gap: 1rem;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 15rem;
`;

const activeOptions = [
  { label: "Active", value: true },
  { label: "Not active", value: false },
];

export default function ProductList() {
  const admin = adminRequest();
  const [active, setActive] = useState(activeOptions[0]);
  const changeProductStatus = changeProductStatusRequest();
  const [search, setSeach] = useState("");
  const [filterBrand, setFilterBrand] = useState();
  const [filterFunc, setFilterFunc] = useState();
  const [filterStatus, setFilterStatus] = useState(activeOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirm, setIsConfirm] = useState();

  const getProductList = getProductListRequest(
    currentPage,
    10,
    filterStatus.value,
    filterFunc?.map((item) => item.value),
    filterBrand?.map((item) => item.value),
    search
  );
  const [isFilterDropDown, setIsFilterDropDown] = useState(false);

  const onChangeStatus = (productId) => {
    const formData = new FormData();

    formData.append("productId", productId);

    changeProductStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getProductList.refetch();
          setIsConfirm();
        }
      },
    });
  };

  return (
    <>
      <Container>
        {getProductList.isLoading && (
          <WaitingContainer>
            <WaitingIcon />
          </WaitingContainer>
        )}

        <SearchContainer>
          <FilterBox>
            <Button1 onClick={() => setIsFilterDropDown((prev) => !prev)}>Filter Option</Button1>
            {isFilterDropDown && (
              <FilterDropDown>
                <div>
                  <h5>Brand filter</h5>
                  <SelectReact
                    value={filterBrand}
                    onChange={setFilterBrand}
                    closeMenuOnSelect={false}
                    isMulti
                    options={brandOptions}
                  />
                </div>
                <div>
                  <h5>Functionality filter</h5>
                  <SelectReact
                    value={filterFunc}
                    onChange={setFilterFunc}
                    closeMenuOnSelect={false}
                    isMulti
                    options={optionsFunction}
                  />
                </div>
              </FilterDropDown>
            )}
          </FilterBox>
          <TextInput state={search} setState={setSeach} placeholder={"Search"} />
          <CustomSelectInput
            state={filterStatus}
            setState={setFilterStatus}
            options={activeOptions}
          />
        </SearchContainer>

        <TableContent>
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Functionality</th>
              <th>Added Date</th>
              <th>Status</th>
              {admin.data.data.role == "admin" && <th>ACTION</th>}
            </tr>
          </thead>
          <tbody>
            {getProductList.isSuccess &&
              getProductList.data.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <ProductColumn>
                        <Avatar round size="50" src={getFirebaseImageUrl(item.imageName)} />{" "}
                        <div>
                          <span>
                            <Link to={"/update_product?id=" + item.id}>
                              {getWords(item.productname, 6)}
                            </Link>
                          </span>
                          <span>{item.variants.length} variants</span>
                        </div>
                      </ProductColumn>
                    </td>
                    <td>{item.brand}</td>
                    <td>{item.functionality.name}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{item.status ? <Active>Active</Active> : <Deactive>Inactive</Deactive>}</td>
                    {admin.data.data.role == "admin" && (
                      <td>
                        <Button2 onClick={() => setIsConfirm(item.id)}>
                          {item.status ? "Deactive" : "Activate"}
                        </Button2>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </TableContent>

        <Footer>
          {getProductList.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getProductList.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {isConfirm && (
        <ConfirmPopUp
          cancel={() => setIsConfirm()}
          message={"confirm?"}
          confirm={() => onChangeStatus(isConfirm)}
        />
      )}
    </>
  );
}
