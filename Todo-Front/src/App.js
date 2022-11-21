import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import "../src/style/App.css";
import { useEffect, useState, React } from "react";
import axios from "axios";

function App() {
  const Todos = ({ todos }) => {//vare todas as todos no BD....
    return (
      <div className="todos">
        {todos.map((todo) => (
          <div className="todo">
            <button
              onClick={() => modifyStatusTodo(todo)} //checkbox todo...
              className="checkbox"
              style={{ backgroundColor: todo.status ? "#5c7cf1" : "white" }} //style click...
            ></button>
            <p>{todo.name}</p> 
            <button onClick={() => handleWithEditButtonClick(todo)} className="pointer">
              <AiOutlineEdit size={20} color={"#64697b"} />
            </button>
            <button onClick={() => deleteTodo(todo)}>
              <AiOutlineDelete size={20} color={"#64697b"} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  async function handleWithNewButton() { //funçao para alternar add todo/ salar todod...
    // console.log("fasfas");
    setInputVisility(!inputVisbility);
  }

  async function handleWithEditButtonClick(todo) {//visible button alternartive...
    setSelectedTodo(todo);
    setInputVisility(true);
  }

  async function getTodos() {//busca as todos no bd...
    const response = await axios.get("http://localhost:3333/todos"); 
    setTodos(response.data);
    console.log(response.data);
  }

  async function editTodo() {//Update todo...
    const response = await axios.put("http://localhost:3333/todos", {
      id: selectedTodo.id,
      name: inputValue,
    });
    setSelectedTodo();
    setInputVisility(false);
    getTodos();
    setInputValue("");
  }

  async function deleteTodo(todo) { //Delete todo...
    const response = await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    getTodos();
  }

  async function modifyStatusTodo(todo) { //modificar status todo...
    const response = await axios.put("http://localhost:3333/todos", {
      id: todo.id,
      status: !todo.status,
    });
    getTodos();
  }

  async function createTodo() { //criar todo...
    const response = await axios.post("http://localhost:3333/todos", {
      name: inputValue,
    });
    // console.log(response);
    getTodos();
    setInputVisility(!inputVisbility);
    setInputValue("");
  }

  //variaveis de estados...
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisbility, setInputVisility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  useEffect(() => {//function to initialize...
    getTodos();
  }, []);

  return (
    <div className="App">
      <header className="container">
        <div className="header">
          <h1>Não Seja Preguiçoso...</h1>
        </div>
        <Todos todos={todos}></Todos>
        <input
          value={inputValue}
          style={{ display: inputVisbility ? "block" : "none" }}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          className="inputName"
          placeholder="Nova Tarefa..."
        />
          <button
            onClick={
              inputVisbility
                ? selectedTodo
                  ? editTodo
                  : createTodo
                : handleWithNewButton
            }
            className="newTaskButton"
          >
            {inputVisbility ? "Salvar" : " + Nova Tarefa"}
          </button>
      </header>
    </div>
  );
}

export default App;