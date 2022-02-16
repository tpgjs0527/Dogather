import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { CardMedia, Input, Stack } from "@mui/material";
import { FetchMoimGroupAPI, FetchMoimMediaAPI } from "../../api/MoimDetail";
// import { Audio, Hearts } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Product from "./MoimDetailComponent/MoimTabs/MoimProduct";
import FAQ from "./MoimDetailComponent/MoimTabs/MoimFAQ";
import Review from "./MoimDetailComponent/MoimTabs/MoimReview";
import Refund from "./MoimDetailComponent/MoimTabs/MoimRefund";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdAtom, userNoAtom } from "../../atoms/Login";
import Hoodie from "../../img/Hoodie.png";
import MoimDetailImg from "./MoimDetailComponent/MoimDetailImg";
import KakaoPay from "./KakaoPay";
import MoimPayment from "./MoimDetailComponent/MoimPayment";
import { detailProducts } from "../../atoms/MoimDetailProps";

interface RouteState {
  state: {
    name: string;
  };
}

interface IProductData {
  group: number;
  products: object;
}

export interface IOptionsData {
  optionNo: string;
  optionName: string;
  optionPrice: number;
}

export interface IGroupData {
  groupNo: number;
  groupLeader: number;
  categoryNo: number;
  deadline: string;
  created: string;
  maxPeople: number;
  view: number;
  status: string;
  product: string; // 상품이름
  detail: string; // 상품상세정보
  link: string; // 상품링크
  originPrice: number; // 출시가
  price: number; // 공구가
  mainImage: string;
  options: Array<IOptionsData>;
  mediaList: Array<string>;
  faqList: Array<object>;
  categoryName: string;
  leaderName: string;
}

export interface IProductContent {
  userNo: number;
  groupNo: string;
  optionName: string;
  optionNo: string;
  amount: number;
  price: number;
  // priceByOption: number;
}
function MoimDetail() {
  // useEffect(() => {
  //   (async () => {
  //     const productData = await (
  //       await fetch(`http://i6e104.p.ssafy.io:8090/product/78`)
  //     ).json();
  //     const data = await (
  //       await fetch(`http://i6e104.p.ssafy.io:8090/group/78`)
  //     ).json();
  //     const groupList = await (
  //       await fetch(`http://i6e104.p.ssafy.io:8090/group/list`)
  //     ).json();
  //     console.log(productData, data);
  //     console.log(groupList);
  //   })();
  // }, []);

  // groupNo에 따라 페이지가 변경되므로 그룹No가 넘어갈 수 있도록 해야함.
  const { groupNo } = useParams();
  const navigate = useNavigate();
  // console.log(typeof groupNo);
  const [detailProduct, setDetailProduct] = useRecoilState(detailProducts);
  // const { state } = useLocation() as RouteState;
  const productMatch = useMatch("/moim/:groupNo");
  const faqMatch = useMatch("/moim/:groupNo/faq");
  const reviewMatch = useMatch("/moim/:groupNo/review");
  const refundMatch = useMatch("/moim/:groupNo/refund");

  const userId = useRecoilValue(userIdAtom);
  const userNo = useRecoilValue(userNoAtom);
  const JWT = localStorage.getItem("login_token");

  const { isLoading: groupLoading, data: groupData } = useQuery<IGroupData>(
    ["group", groupNo, userId, JWT, userNo],
    () => FetchMoimGroupAPI(groupNo!, userId!, JWT!, userNo)
  );

  // console.log(groupData?.options);
  // console.log(groupLoading);
  // console.log(groupData?.mediaList[0]);

  // const loading = productLoading || isLoading;

  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    console.log(groupData);
    setTimeout(() => {
      setLoading(false);
      setHidden(false);
    }, 100);
  }, []);

  const basePrice = groupData?.price!;
  // console.log(basePrice);
  const [optionIdx, setOptionIdx] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isHidden, setIsHidden] = useState(true);

  const [price, setPrice] = useState(0);
  const [product, setProduct] = useState<Array<IProductContent>>([]);
  const [products, setProducts] = useState<Array<IProductContent>>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [priceByOption, setPriceByOption] = useState(0);
  const [totalPriceByOption, setTotalPriceByOption] = useState(0);
  const [payment, setPayment] = useState("");

  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // console.log(typeof value);
    const splitValueOption = value.split("/")[0];
    const splitValuePrice = value.split("/")[1];
    const splitValueOptionNo = value.split("/")[2];
    console.log(totalPriceByOption);
    console.log(quantity);
    product.splice(product.length, 0, {
      userNo: userNo,
      groupNo: groupNo!,
      optionName: splitValueOption,
      optionNo: splitValueOptionNo,
      amount: quantity,
      price: Number(splitValuePrice),
      // priceByOption: totalPriceByOption,
      // price: totalPriceByOption,
    });
    // setProducts(newObject);

    const newObject = [...product];
    const newPrice = priceByOption;
    setIsHidden(false);
    setOptionIdx(Number(value));
    setProducts(newObject);
    setTotalPriceByOption(newPrice);
  };
  console.log(products);

  // const onApply = (event: React.ChangeEvent<HTMLButtonElement>) => {};

  //처음 랜더링되고 유저에게 보이는 수량의 값이 0일 필요가 없기 때문에 초기값으로 1로 주었다.

  // const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   console.log(value);
  //   // console.log(typeof value);
  //   const splitValueOption = value.split("/")[0];
  //   const splitValuePrice = value.split("/")[1];
  //   console.log(splitValueOption);
  //   // console.log(typeof splitValuePrice);
  //   options.map((option, idx) => {
  //     if (options.length != groupData?.options.length!) {
  //       console.log(splitValueOption);
  //       if (option !== splitValueOption) {
  //         console.log(splitValueOption);
  //         setOption([...options, splitValueOption]);
  //       }
  //     }
  //   });
  //   // const _price : string[] = optionPrice.map((price, idx))
  //   setIsHidden(false);
  // };
  // console.log(options);
  // console.log(optionPrice)

  const increaseQuantity = (o: IProductContent, idx: number) => {
    const sum = o.price + basePrice;
    setPrice(price + sum);
    o.amount += 1;
    setTotalAmount(totalAmount + 1);
    setPriceByOption(sum * o.amount);
  };

  const decreaseQuantity = (o: IProductContent, idx: number) => {
    const sum = o.price + basePrice;
    setPrice(price - sum);
    o.amount -= 1;
    setTotalAmount(totalAmount - 1);
    setPriceByOption(sum * o.amount);
  };

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(Number(value));
    setTotalPriceByOption(priceByOption);
    console.log(value);
  };

  // const onApply = () => {
  //   console.log(products.length, price);
  //   console.log(payment);
  //   if (!products.length) {
  //     alert("옵션을 선택해주세요");
  //     setTimeout(() => navigate(`/moim/${groupNo}`), 1);
  //   } else {
  //     if (!price) {
  //       alert("물품 수량을 선택해주세요");
  //       setTimeout(() => navigate(`/moim/${groupNo}`), 1);
  //     } else {
  //       if (price < basePrice * totalAmount) {
  //         alert("옵션별 수량을 모두 선택해주세요.");
  //         setTimeout(() => navigate(`/moim/${groupNo}`), 1);
  //       }
  //     }
  //   }
  // };

  // const mainImgAddress =
  //   process.env.PUBLIC_URL + "/doimage/" + groupData?.mainImage;
  const mainImgAddress = process.env.PUBLIC_URL + "/img/Hoodie.png";
  // console.log(groupData?.mainImage);
  const detailImgAddress =
    process.env.PUBLIC_URL + "/doimage/" + groupData?.mediaList[0];
  // console.log(mainImgAddress, detailImgAddress);

  const time = Date.now();
  // console.log(time);
  const makeComma = (price: number) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  console.log(groupData);

  return (
    <Container>
      <MoimWrapper>
        {loading ? null : (
          <>
            <Overview>
              <ImgWrapper>
                {/* <Img
                  src={process.env.PUBLIC_URL + "/img/Hoodie.png"}
                  alt={"메인 이미지"}
                /> */}
                <Img src={mainImgAddress} alt={mainImgAddress} />
                <Img src={detailImgAddress} alt={detailImgAddress} />
                {/* <MoimDetailImg /> */}
              </ImgWrapper>
              <OverviewItem>
                <img
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "120px",
                    height: "20px",
                    marginBottom: "3px",
                  }}
                  src={process.env.PUBLIC_URL + "/img/베스트라벨.png"}
                  alt=""
                />
                <CategoryName>{groupData?.categoryName}</CategoryName>
                <LeaderName>{groupData?.leaderName}</LeaderName>

                <ProductTitle>{groupData?.product}</ProductTitle>
                <ProductDetail>{groupData?.detail}</ProductDetail>
                <ProductPrice>
                  <ProductOriginalPrice>
                    {/* {makeComma(groupData?.originPrice!) + "원"} */}
                  </ProductOriginalPrice>
                  <ProductMoimPrice>
                    {/* {makeComma(groupData?.price!) + "원"} */}
                  </ProductMoimPrice>
                </ProductPrice>
                <Option>{"옵션선택"}</Option>
                {/* {groupData?.options.map((option, idx) => (
                  <MoimSelect
                    optionName={option.optionName}
                    optionPrice={option.optionPrice}
                  />
                ))} */}
                <SelectContainer>
                  <SelectWrapper>
                    <SelectContent>
                      <SelectSelect
                        onChange={onSelect}
                        placeholder="옵션을 선택해주세요."
                      >
                        <SelectOption value="0">
                          옵션을 선택해주세요.
                        </SelectOption>
                        {groupData?.options?.map((option, idx) => (
                          <SelectOption
                            key={idx}
                            // onChange={}
                            value={
                              option.optionName +
                              "/" +
                              option.optionPrice +
                              "/" +
                              option.optionNo
                            }
                          >
                            {option.optionName +
                              " / " +
                              "+" +
                              option.optionPrice +
                              "원"}
                          </SelectOption>
                        ))}
                      </SelectSelect>
                    </SelectContent>
                    {products &&
                      products.map((o, idx) => {
                        return (
                          <>
                            <OptionWrapper key={idx}>
                              <CartOption>
                                <SelectContentItem>
                                  <OptionName>
                                    옵션명 :{" "}
                                    {o.optionName + "(+" + o.price + ")"}
                                  </OptionName>
                                </SelectContentItem>
                                <SelectContentItem>
                                  <QuantityButton
                                    className="purchaseButton"
                                    onClick={() => decreaseQuantity(o, idx)} //onClick이 되면 카운팅이 감소되는 함수실행
                                    disabled={o.amount < 1}
                                  >
                                    {"-"}
                                  </QuantityButton>
                                  <SelectInput
                                    className="productQuantity"
                                    type="text"
                                    onChange={handleValue} //onChange될때마다 값을 얻음
                                    value={o.amount} //값은 count의 state를 담는다.
                                  />
                                  <QuantityButton
                                    className="purchaseButton"
                                    onClick={() => increaseQuantity(o, idx)}
                                    disabled={o.amount < 0}
                                  >
                                    {"+"}
                                  </QuantityButton>
                                </SelectContentItem>
                              </CartOption>
                            </OptionWrapper>
                          </>
                        );
                      })}
                    <OptionWrapper>
                      <CartOption>
                        <PriceWrapper>
                          <ProductQuantity>
                            {"총 " + totalAmount + "개"}
                          </ProductQuantity>
                          <FinalPrice>{makeComma(price) + "원"}</FinalPrice>
                        </PriceWrapper>
                      </CartOption>
                    </OptionWrapper>
                    <SelectContent>
                      <Button
                        style={{
                          backgroundColor: "tomato",
                          borderColor: "black",
                        }}
                      >
                        <Link to={"/"}>관심등록</Link>
                      </Button>
                      <Link
                        // onClick={() => onApply()}
                        style={{ width: "100%" }}
                        to={`/moim/${groupNo}/payment`}
                        state={{
                          products: products,
                          groupNo: groupNo!,
                          price: price,
                          img: mainImgAddress,
                          leaderName: groupData?.leaderName!,
                          productName: groupData?.product!,
                          ProductDetail: groupData?.detail!,
                          categoryName: groupData?.categoryName!,
                          basePrice: basePrice,
                        }}
                      >
                        <Button style={{ backgroundColor: "#6fbd63" }}>
                          모임신청
                        </Button>
                      </Link>
                    </SelectContent>
                  </SelectWrapper>
                </SelectContainer>

                {/* <span>단돈 {groupData?.price}원</span>
                <span>
                  모임 인원 : 현재신청인원 / {groupData?.maxPeople} (여기는%)
                </span>
                <span>마감 기한 : {groupData?.deadline}</span> */}
              </OverviewItem>
            </Overview>
            <Tabs>
              <Tab isActive={productMatch !== null}>
                <Link to={`/moim/${groupNo}`}>상품상세</Link>
              </Tab>
              <Tab isActive={faqMatch !== null}>
                <Link to={`/moim/${groupNo}/faq`}>FAQ</Link>
              </Tab>
              <Tab isActive={reviewMatch !== null}>
                <Link to={`/moim/${groupNo}/review`}>모임평</Link>
              </Tab>
              <Tab isActive={refundMatch !== null}>
                <Link to={`/moim/${groupNo}/refund`}>교환/환불</Link>
              </Tab>
            </Tabs>
            <Routes>
              <Route path="" element={<Product img={Img} />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="review" element={<Review />} />
              <Route path="refund" element={<Refund />} />
            </Routes>
          </>
        )}
      </MoimWrapper>
    </Container>
  );
}
const LeaderName = styled.p`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const CategoryName = styled.p`
  display: flex;
  align-items: center;
  color: grey;
  font-size: 14px;
  margin-bottom: 5px;
`;
const ProductTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;
const ProductDetail = styled.p`
  margin-bottom: 10px;
  word-spacing: 2px;
  line-height: 20px;
`;

const Option = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProductPrice = styled.div`
  margin-bottom: 20px;
`;
const ProductOriginalPrice = styled.p`
  color: grey;
  font-size: 16px;
  /* margin-bottom: 2px; */

  text-decoration: line-through;
`;
const ProductMoimPrice = styled.p`
  font-size: 24px;
  font-weight: bold;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: whitesmoke;
`;

const MoimWrapper = styled.div`
  width: 70%;
  margin-top: 65px;
`;

const Title = styled.p`
  font-size: 48px;
  padding-top: 500px;
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Img = styled.img`
  height: 500px;
  width: 500px;
  object-fit: cover;
  overflow: hidden;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-evenly;
  background-color: white;
  padding: 10px 20px;

  /* box-shadow: 3px 3px 10px 3px lightgrey; */
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: 600px;
  height: auto;
  span {
    font-size: 20px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 25px 0px;
  gap: 20px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: bold;
  background-color: white;
  padding: 7px 0px;
  border-radius: 20px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

const SelectContainer = styled.div`
  display: block;
`;

const OptionWrapper = styled.div`
  border-color: grey;
  border-width: 1px;
`;

const SelectContent = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  width: 100%;
`;
const SelectContentItem = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`;

const SelectCart = styled.button`
  display: block;
  justify-content: center;
  font-size: 20px;
`;

const SelectWrapper = styled.div``;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: white;
  border-width: 1px;
  border-color: grey;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 5px;

  :hover {
    background-color: #f3f3f3;
    opacity: 0.5;
  }
`;

const SelectInput = styled.input`
  font-size: 16px;
  color: grey;
  width: 50px;
  height: 30px;
  text-align: center;
  margin-bottom: 10px;
  border-radius: 5px;
  /* border-radius: 5px; */
  border-color: black;
  border-width: 1px;
  :hover {
    outline: auto;
  }
  ::-webkit-inner-spin-button {
    width: 50px;
    height: 20px;
    -webkit-appearance: "Always Show Up/Down Arrows";
  }
`;

const SelectSelect = styled.select`
  width: 100%;
  height: 40px;
  font-size: 16px;
  color: grey;
  margin-bottom: 10px;
  border-radius: 5px;
  border-color: black;
  border-width: 2px;
  :hover {
    outline: auto;
  }
`;

const SelectOption = styled.option`
  font-size: 14px;
`;

const CartOption = styled.div`
  border-color: grey;
`;

const OptionName = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;

const PriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductQuantity = styled.p`
  font-size: 14px;
`;
const FinalPrice = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const Button = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  border-radius: 10px;
  font-weight: bold;
  color: white;
  :hover {
    cursor: pointer;
  }
`;

export default MoimDetail;
