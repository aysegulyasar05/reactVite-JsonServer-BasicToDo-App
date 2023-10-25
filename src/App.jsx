import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import EditModal from "./components/EditModal";

function App() {
  const [todos, setTodos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const[editingItem,setEditingItem]=useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3030/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, []);

  //!once Apiyi güncelle eger güncelleme basariliysa sonra stati güncelle

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = {
      id: new Date().getTime(),
      title: e.target[0].value,
      date: new Date(),
      isDone: false,
    };

    axios
      .post("http://localhost:3030/todos", newTodo)
      .then(() => setTodos([...todos, newTodo]))
      .catch(() => alert("Sorry couldnt add.."));

    e.target[0].value = "";
  };

  const handleDelete = (delete_id) => {
    axios
      .delete(`http://localhost:3030/todos/${delete_id}`)
      .then(() => {
        const filtred = todos.filter((todo) => todo.id !== delete_id);
        setTodos(filtred);
      })
      .catch(() => alert("Error"));
  };

  //checkboxa click olunca ;

  const handleStatusChange = (todo) => {
    //isdone degerini tersine cevir
    const updatedTodo = { ...todo, isDone: !todo.isDone };
    console.log(updatedTodo);

    //dizideki id ye göre güncelleme
    axios
      //api güncelle
      .put(`http://localhost:3030/todos/${todo.id}`, updatedTodo)
      //arayüz güncelle
      .then(() =>
        setTodos(
          todos.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
        )
      );
  };

  //edit butonuna tiklayinca

  const handleModal = (todo) => {
    setShowModal(true);
    //düzenleneck elmani state aktar
    setEditingItem(todo)
  };

  //düzenleme islemi onaylandiginda save butonu

  const handleEditConfirm = () => {
    //Apiyi güncelle

    axios
    .put(`http://localhost:3030/todos/${editingItem.id}`,editingItem)
    .then(()=>{
      const clone =[...todos];
      const index = clone.findIndex((i) => i.id === editingItem.id);
      if(index=== -1) return;
      clone[index] =editingItem;
      setTodos(clone);
      setShowModal(false)
    })

    //state i güncelle
  }

  return (
    <div className="container my-5">
      <h2 className="text-center">To-Do List</h2>

      <form className="d-flex gap-3 my-4" onSubmit={handleSubmit}>
        <input className="form-control" type="text" />
        <button className="btn btn-primary">Add</button>
      </form>

      {!todos && <h3>Loading....</h3>}

      <ul className="list-group my-5 ">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex gap-3">
              <input
                checked={todo.isDone}
                onClick={() => handleStatusChange(todo)}
                type="checkbox"
                className="form-check-input shadow"
              />
              <span>{todo.isDone ? "Completed" : "Not Completed"}</span>
            </div>
            <span>{todo.title}</span>
            <div className="btn-group">
              <button
                onClick={() => handleModal(todo)}
                className="btn btn-success"
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <EditModal
          setShowModal={setShowModal}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          handleEditConfirm={handleEditConfirm}
        />
      )}
    </div>
  );
}

export default App;
