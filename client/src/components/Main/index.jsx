import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { TextField, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};
function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.300",
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const Main = () => {
  const [tasks, setTasks] = useState(null);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [data, setData] = useState({
    taskTitle: "",
    taskDetail: "",
    taskDeadline: "",
    completed: false,
  });
  const [permData, setPermData] = useState(tasks);
  const [task, setTask] = useState(data);
  const [filter, setFilter] = useState("");
  const JWT = localStorage.getItem("token");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    // console.log(filter)
  };
  const filterProduct = (filter) => {
    if (filter == "completed") {
      const filteredtasks = permData.filter((ele) => {
        return ele.completed == true;
      });
      setTasks(filteredtasks);
    } else if (filter == "pending") {
      const filteredtasks = permData.filter((ele) => {
        return ele.completed == false;
      });
      setTasks(filteredtasks);
    } else if (filter == "all") {
      setTasks(permData);
    }
  };
  useEffect(() => {
    filterProduct(filter);
  }, [filter]);

 
  const handleInput = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
    // console.log(data.taskDeadline)
  };
  const handleEditInput = (e) => {
    e.preventDefault();
    setTask({ ...task, [e.target.name]: e.target.value });
    setTask({
      ...task,
      [task.taskDeadline]: new Date(task.taskDeadline).toLocaleDateString(),
    });
    // console.log(data.taskDeadline)
  };
  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://todo-app-qmvs.onrender.com/api/tasks", {
        headers: {
          token: JWT,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      // console.log(res)
      if (res.status == 200) {
        setTasks(res.data.tasks);
        setPermData(res.data.tasks);
      } else console.log("Error :", res.status);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todo-app-qmvs.onrender.com/api/tasks/create-task",
        data,
        {
          headers: {
            token: JWT,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        setTaskModal(false);
        alert("Task created successfully");

        await fetchTasks();
      } else {
        alert("Failed to create task. Please check your input.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (task_data) => {
    try {
      setTaskId(task_data._id);
      const res = await axios.delete(
        `https://todo-app-qmvs.onrender.com/api/tasks/${taskId}`
      );
      if (res.status == 200) {
        await fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (task_data) => {
    setEditModal(true);
    setTaskId(task_data._id);
    setTask({
      ...task,
      taskTitle: task_data.taskTitle,
      taskDetail: task_data.taskDetail,
      taskDeadline: task_data.taskDeadline,
    });
    console.log(task);
  };
  const handleUpdate = async (task_data) => {
    try {
      const res = await axios.put(`https://todo-app-qmvs.onrender.com/api/tasks/${taskId}`, {
        taskTitle: task_data.taskTitle,
        taskDetail: task_data.taskDetail,
        taskDeadline: task_data.taskDeadline,
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };
  const handleComplete = async (task) => {
    try {
      const res = await axios.put(`https://todo-app-qmvs.onrender.com/api/tasks/${taskId}`, {
        ...task,
        completed: true,
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "teal" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              ToDo App
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ mt: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Item>
            {" "}
            <Button
              variant="outlined"
              onClick={() => setTaskModal(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "#0069d9",
                  borderColor: "#0062cc",
                  color: "#ffff",
                  boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
                },
              }}
            >
              Create Task
            </Button>
          </Item>
          <Item>
            {" "}
            <FormControl
              sx={{
                minWidth: 120,
                borderColor: "#0276e3",
                backgroundColor: "#288ae7",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#44bae2",
                },
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label" sx={{ color: "white" }}>
                Filter
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={filter}
                label="filter"
                onChange={handleFilterChange}
                sx={{
                  "&.MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  color: "white",
                }}
              >
                <MenuItem value="all">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Item>
        </Box>

        <Modal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Task Details</h2>
            <form>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Title"
                name="taskTitle"
                onChange={(e) => handleInput(e)}
                value={data.taskTitle}
                fullWidth
                required
                sx={{ mb: 4 }}
              />

              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Details"
                name="taskDetail"
                multiline
                rows={2}
                maxRows={4}
                onChange={(e) => handleInput(e)}
                value={data.taskDetail}
                fullWidth
                required
                sx={{ mb: 4 }}
              />

              <TextField
                type="date"
                variant="outlined"
                color="secondary"
                label="Task Deadline"
                name="taskDeadline"
                onChange={(e) => handleInput(e)}
                value={data.taskDeadline}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  onClick={handleCreate}
                >
                  Create Task
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setTaskModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
        <Modal
          open={editModal}
          onClose={() => setEditModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Edit Details</h2>
            <form>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Title"
                name="taskTitle"
                onChange={(e) => handleEditInput(e)}
                value={task.taskTitle}
                fullWidth
                required
                sx={{ mb: 4 }}
              />

              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Details"
                name="taskDetail"
                multiline
                rows={2}
                maxRows={4}
                onChange={(e) => handleEditInput(e)}
                value={task.taskDetail}
                fullWidth
                required
                sx={{ mb: 4 }}
              />

              <TextField
                type="date"
                variant="outlined"
                color="secondary"
                label="Task Deadline"
                name="taskDeadline"
                onChange={(e) => handleEditInput(e)}
                value={task.taskDeadline}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  onClick={() => handleUpdate(task)}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>

        <h1>Tasks :</h1>
        <Grid container spacing={2}>
          {tasks && tasks !== undefined && tasks.length > 0 ? (
            tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card
                  sx={{
                    maxWidth: 300,
                    bgcolor: "#e0f2f1",
                    borderRadius: "8px",
                    padding: "8px",
                    marginBottom: "20px",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                    boxShadow: "0px 8px 14px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      border: "white",
                      backgroundColor: "#b9f6ca",
                      boxShadow: "0px 18px 18px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {task.taskTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.taskDetail}
                    </Typography>
                    {task.completed ? (
                      <Typography variant="body" color="green">
                        Completed
                      </Typography>
                    ) : (
                      <Typography
                        variant="body"
                        style={{
                          color:
                            new Date() < new Date(task.taskDeadline)
                              ? "green"
                              : "red",
                        }}
                      >
                        Due Date :
                        {new Date(task.taskDeadline).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>

                  <Stack
                    direction="row"
                    spacing={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      style={{ backgroundColor: "#f1f8e9" }}
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      style={{ backgroundColor: "#ffebee" }}
                      onClick={() => handleDelete(task)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      style={{
                        backgroundColor: "#e0f7fa",
                        fontSize: "10px",
                        height: "36px",
                      }}
                      onClick={() => handleComplete(task)}
                    >
                      Mark Complete
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))
          ) : (
            <Container sx={{ marginTop: 2 }}>No task found...</Container>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Main;
