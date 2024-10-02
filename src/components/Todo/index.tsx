"use client";
import { API } from "@/src/constants/API";
import { ITodo } from "@/src/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TodoList from "../TodoList";

const Todo = () => {
  const [inputValue, setInputValue] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editInputValue, setEditInputValue] = useState("");
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(false);

  const getTodo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHandleTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const todo = { title: inputValue };
      try {
        await axios.post(API, todo);
        setInputValue("");
        getTodo();
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API}/${id}`);
      getTodo();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editHandler = async () => {
    if (editInputValue.trim()) {
      const updateData = { title: editInputValue };
      try {
        await axios.patch(`${API}/${editId}`, updateData);
        getTodo();
        setEditId(null);
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  return (
    <div className="my-auto mt-6 container">
      <h1>Let's do it!</h1>
      <form className="" onSubmit={addHandleTodo}>
        <input
          type="text"
          value={inputValue}
          placeholder="Go on..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Add todo</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : todos.length ? (
        <TodoList
          todos={todos}
          editId={editId}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          setEditId={setEditId}
          editHandler={editHandler}
          deleteTodo={deleteTodo}
        />
      ) : (
        <h2>You don't have todos! Please, add your todo!</h2>
      )}
    </div>
  );
};

export default Todo;
