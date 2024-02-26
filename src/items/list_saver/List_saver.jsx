import React, { useState, useEffect } from "react";
import "./list_saver.css";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../../helpers/StrictModeDroppable";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  remove,
  update,
  onValue,
} from "firebase/database";
import Navbar from "../components/navbar/Navbar";

/*you will need to install the following packages
npm install react-toastify
npm install react-beautiful-dnd
npm install react-bootstrap
npm install react-icons
npm install json-server (this is incase u use a local server, then use the db.json file in the root to store data) or install the below file
npm install firebase (this is incase u use firebase as your backend server, then use the firebase.js file in the root to store data) its free */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBpN3uhu9JULHHlfzV41573fn8jnhWAd0Q",
  authDomain: "list-saver.firebaseapp.com",
  databaseURL: "https://list-saver-default-rtdb.firebaseio.com",
  projectId: "list-saver",
  storageBucket: "list-saver.appspot.com",
  messagingSenderId: "980415260322",
  appId: "1:980415260322:web:e396a9c46c12f793bf99fb",
  measurementId: "G-ZD5JX6YE8J",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const List_saver = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const itemsRef = ref(database, "items_pb"); // Changed from "items" to "items_pb"

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setItems(itemsArray.sort((a, b) => a.order - b.order));
      } else {
        setItems([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addItem = () => {
    if (newItem.trim() !== "") {
      const order = items.length > 0 ? items[items.length - 1].order + 1 : 0;
      const itemsRef = ref(database, "items_pb"); // Changed from "items" to "items_pb"
      push(itemsRef, { text: newItem, completed: false, order })
        .then(() => {
          toast.success("Item added successfully!");
          setNewItem(""); // Clear the input box
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          toast.error("Failed to add item.");
        });
    } else {
      toast.error("Please enter a valid item.");
    }
  };

  const removeItem = (id) => {
    const itemRef = ref(database, `/items_pb/${id}`); // Changed from "/items/" to "/items_pb/"
    remove(itemRef)
      .then(() => {
        toast.warn("Item removed!");
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  const toggleCompletion = (id, completed) => {
    const itemRef = ref(database, `/items_pb/${id}`); // Changed from "/items/" to "/items_pb/"
    update(itemRef, { completed: !completed }).catch((error) => {
      console.error("Error toggling item completion:", error);
    });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.index === destination.index) return;

    const updatedItems = Array.from(items);
    const [reorderedItem] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, reorderedItem);

    updatedItems.forEach((item, index) => (item.order = index));
    setItems(updatedItems);

    updatedItems.forEach((item) => {
      const itemRef = ref(database, `/items_pb/${item.id}`); // Changed from "/items/" to "/items_pb/"
      update(itemRef, { order: item.order });
    });
  };

  const completedItemCount = items.filter((item) => item.completed).length;
  return (
    <div className="listsaver">
      <Navbar />
      <Container className="list_saver">
        <Row className="mt-3">
          <Col>
            <h1>List Maker</h1>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="list-data">
            <p>Total Items: {items.length}</p>
            <p>Completed Items: {completedItemCount}</p>
          </Col>
        </Row>
        <Row className="mt-3 ">
          <Col className="add-items">
            <Form.Control
              type="text"
              className="add-items-input-box"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add an item..."
            />
            <Button variant="success" className="add-icon" onClick={addItem}>
              <FaPlus className="list-icon " />
            </Button>
          </Col>
        </Row>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable-item">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={item.completed ? "completed" : ""}
                      >
                        {item.text}
                        <div className="buttons">
                          <Button
                            variant="outline-success"
                            onClick={() =>
                              toggleCompletion(item.id, item.completed)
                            }
                            className="mr-2"
                          >
                            <FaCheck className="list-icon" />
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => removeItem(item.id)}
                          >
                            <FaTrash className="list-icon" />
                          </Button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
    </div>
  );
};

export default List_saver;
