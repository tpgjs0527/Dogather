/* FAQ 리스트 렌더링 */

import React from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { FAQsAtom } from "../../../../atoms/FAQs";
import { Draggable } from "react-beautiful-dnd";

interface IFAQProps {
  index: number;
  id: number;
  faqQuestion: string;
  faqAnswer: string;
}

function FAQ({ index, id, faqQuestion, faqAnswer }: IFAQProps) {
  const [FAQs, setFAQs] = useRecoilState(FAQsAtom);
  // console.log(id, option_name, option_price);

  const onClick = () => {
    // console.log(options);
    setFAQs((prev) => {
      const targetIndex = prev.findIndex((FAQ) => FAQ.id === id);
      // console.log(targetIndex);
      return [...prev.slice(0, targetIndex), ...prev.slice(targetIndex + 1)];
    });
  };

  return (
    <Draggable key={id} draggableId={id + ""} index={index}>
      {(magic, snapshot) => (
        <List
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <Element>{faqQuestion} </Element>
          <Element>{faqAnswer} </Element>
          <Element>
            <Button onClick={onClick}>삭제</Button>
          </Element>
        </List>
      )}
    </Draggable>
  );
}

const List = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  min-height: 30px;
  border: 1px solid whitesmoke;
  background-color: ${(props) => (props.isDragging ? "#1e272e" : "white")};
  color: ${(props) => (props.isDragging ? "white" : "#1e272e")};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const Element = styled.div`
  width: 100%;
  word-break: break-all;
  font-size: 14px;
  text-align: center;
`;

const Button = styled.button`
  border-radius: 5px;
  border: none;
  background-color: #c23616;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

export default React.memo(FAQ);
