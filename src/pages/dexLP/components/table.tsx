import styled from "@emotion/styled";

const Container = styled.table`
  & {
    border: none;
    margin: 5px auto;
    width: 1204px;
    color: var(--primary-color);
    text-align: center;
    border-collapse: collapse;
    border-spacing: 0;
  }
  thead {
    text-transform: lowercase;
    font-size: 14px;
    background-color: #06fc9a1b;
    tr {
      border-bottom: var(--primary-color) solid 1px !important;
    }
  }
  th {
    padding: 8px;
    font-weight: 400;
    line-height: 1rem;
  }

  tr {
    font-size: 14px;
    font-weight: 400;
    line-height: 4rem;
    border-bottom: transparent solid 1px;

    animation: fader 0.5s;
    animation-fill-mode: forwards;

    /*  */
    @keyframes fader {
      0% {
        border-bottom: transparent solid 1px;
      }
      to {
        border-bottom: var(--primary-color) solid 1px;
      }
    }
  }

  tbody {
    border: var(--primary-color) solid 1px;

    tr:hover {
      background-color: #06fc9a1b;
      cursor: pointer;
    }
  }
  @media (max-width: 1000px) {
    width: 800px;
    margin: 0 2rem;
  }
`;
type Props = {
  children: React.ReactNode;
  columns: string[];
};

const Table: React.FC<Props> = (props: Props) => {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <Container>
        <thead>
          <tr>
            {props.columns.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </Container>
    </div>
  );
};

export default Table;
