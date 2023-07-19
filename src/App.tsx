import { ReactNode, useCallback } from "react";
import "./App.css";

const Heading = ({ title }: { title: string }) => {
  return <h2>{title}</h2>;
};

const Box = ({ children }: { children: ReactNode }) => {
  return <div style={{ padding: "1rem", fontWeight: "bold" }}>{children}</div>;
};

const List = ({
  items,
  onClick,
}: {
  items: string[];
  onClick?: (item: string) => void;
}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => onClick?.(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
};

function App() {
  const onListClick = useCallback((item: string) => {
    alert(item);
  }, []);
  return (
    <div>
      <Heading title="Introduction" />
      <Box>Hello there</Box>
      <List items={["one", "two", "three"]} onClick={onListClick} />
    </div>
  );
}

export default App;
