import React, {
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
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

interface Payload {
  text: string;
}

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

type ActionType =
  | {
      type: "ADD";
      text: string;
    }
  | { type: "REMOVE"; id: number };

const useNumber = (initialValue: number) => useState<number>(initialValue);

type UseNumberValue = ReturnType<typeof useNumber>[0];
type UseNumberSetValue = ReturnType<typeof useNumber>[1];

const Incrementer = ({
  value,
  setValue,
}: {
  value: UseNumberValue;
  setValue: UseNumberSetValue;
}) => {
  return <Button onClick={() => setValue(value + 1)}>Add - {value} </Button>;
};

const Button: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    title?: string;
  }
> = ({ title, children, style, ...otherProps }) => (
  <button
    {...otherProps}
    style={{
      ...style,
      backgroundColor: "red",
      color: "white",
      fontSize: "xx-large",
    }}
  >
    {title ?? children}
  </button>
);

function App() {
  const [payload, setPayload] = useState<Payload | null>(null);

  const onListClick = useCallback((item: string) => {
    alert(item);
  }, []);

  useEffect(() => {
    fetch("/data.json")
      .then((resp) => resp.json())
      .then((data) => setPayload(data));
  }, []);

  const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
    switch (action.type) {
      case "ADD":
        return [
          ...state,
          { id: state.length + 1, text: action.text, done: false },
        ];

      case "REMOVE":
        return state.filter(({ id }) => id !== action.id);

      default:
        throw new Error();
    }
  }, []);

  const newTodoRef = useRef<HTMLInputElement>(null);

  const onAddTodo = useCallback(() => {
    if (!newTodoRef.current) return;
    dispatch({ type: "ADD", text: newTodoRef.current.value });
    newTodoRef.current.value = "";
  }, []);

  const [value, setValue] = useNumber(0);

  return (
    <div>
      <Heading title="Introduction" />
      <Box>Hello there</Box>
      <List items={["one", "two", "three"]} onClick={onListClick} />
      <Box>{JSON.stringify(payload)}</Box>

      <Incrementer value={value} setValue={setValue} />

      <Heading title="TODO section" />
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.text}
          <Button
            onClick={() =>
              dispatch({
                type: "REMOVE",
                id: todo.id,
              })
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <div>
        <input type="text" ref={newTodoRef} />
        <Button onClick={onAddTodo}>Add</Button>
      </div>
    </div>
  );
}

export default App;
