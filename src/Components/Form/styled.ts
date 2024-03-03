import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 600px;
  margin: 50px auto 0 auto;

  padding: 18px;

  border: 1px solid #fafafa;
  border-radius: 2px;

  h1 {
    line-height: 80%;
  }

  span {
    margin-bottom: 8px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 1.4rem;
  }

  label {
    display: flex;
    flex-direction: column;
  }

  input[type="radio"] {
    cursor: pointer;
  }

  input[type="text"],
  textarea {
    width: 100%;
    max-width: 380px;

    border: none;

    color: white;
    outline: 0;

    background-color: transparent;
  }

  input[type="text"] {
    margin-top: 5px;
    padding: 0 10px 3px 8px;

    border-bottom: 1px solid #fafafa;
  }

  textarea {
    height: 100px;
    padding: 8px;
    border: 1px solid #fafafa;

    resize: none;
  }

  hr {
    margin: 30px 0;

    &:nth-child(3) {
      margin-top: 0;
      margin-bottom: 20px;
    }
  }

  li {
    cursor: pointer;
  }

  img {
    width: 100%;
    object-fit: cover;
  }
`;

export const Ul = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;

  img {
    height: 140px;

    transition: transform 0.12s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.04);
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const InputFile = styled.div`
  width: 180px;
  height: 180px;
  padding: 8px;

  margin-top: 5px;

  display: flex;
  align-items: center;
  text-align: center;

  background-color: #454545;

  border: 2px dashed white;
  border-radius: 5px;

  position: relative;

  input {
    position: absolute;
    top: 0;
    left: 0;

    margin-bottom: 100px;

    z-index: 100;

    width: 100%;
    height: 100%;

    opacity: 0;

    background-color: blue;
    cursor: pointer;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const DivButton = styled.div`
  width: 100%;
  /* max-width: 400px; */
  
  display: flex;
  justify-content: space-between;

  button:nth-child(2) {
    width: fit-content;
    padding: 7px 15px;

    font-weight: 600;
    color: #ff9090;

    border: 1px solid #ff9090;

    background-color: transparent;

    transition: background 0.15s ease-in-out;

    &:hover {
      color: black;
      background-color: #ff9090;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
`;

export const Button = styled.button`
  width: fit-content;
  padding: 7px 15px;

  font-weight: 600;
  color: white;

  border: 1px solid #fafafa;

  background-color: transparent;

  transition: background 0.15s ease-in-out;

  &:hover {
    color: black;
    background-color: #fafafa;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
