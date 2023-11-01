import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  Heading,
  VStack,
  Text,
  Checkbox,
  IconButton,
  CloseIcon,
  DeleteIcon,
  AddIcon,
  Input,
  useToast,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskList() {
  useEffect(() => {
    const loadTasksFromStorage = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tareas");
        if (storedTasks) {
          const parseTasks = JSON.parse(storedTasks);
          setTasks(parseTasks);
        }
      } catch (error) {
        console.log(error, "Error al cargar las tareas");
      }
    };
    loadTasksFromStorage();
  }, []);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  function handleDelete(indexToDelete) {
    setTasks(function (currentTasks) {
      const updateTasks = currentTasks.filter(
        (_, index) => index !== indexToDelete,
        toast.show({
          title: "Task deleted",
          status: "error",
        })
      );
      AsyncStorage.setItem("tareas", JSON.stringify(updateTasks));
      return updateTasks;
    });
  }

  function handleStatusChange(indexToChange) {
    setTasks(function (currentTasks) {
      const newTasks = [...currentTasks];
      newTasks[indexToChange].isCompleted =
        !newTasks[indexToChange].isCompleted;
      AsyncStorage.setItem("tareas", JSON.stringify(newTasks));
      return newTasks;
    });
  }

  function onChangeText(v) {
    setInputValue(v);
  }

  function onTaskAdd() {
    if (inputValue !== "") {
      toast.show({
        title: "Task added",
        status: "success",
      });
      setTasks(function (currentTasks) {
        const newTasks = [
          ...currentTasks,
          {
            title: inputValue,
            isCompleted: false,
          },
        ];
        // Almacenar la lista de tareas como una cadena JSON
        AsyncStorage.setItem("tareas", JSON.stringify(newTasks));
        return newTasks;
      });
      setInputValue(""); // Limpia el campo de entrada después de agregar una tarea
    } else {
      toast.show({
        title: "Task cannot be empty",
        status: "error",
      });
    }
  }

  return (
    <Box
      rounded="lg"
      shadow={1}
      bg="white"
      px="2"
      py="4"
      w="100%"
      mx="auto"
      mb="4"
    >
      <Heading mb="2" size="md">
        Task List
      </Heading>
      <Box>
        <HStack space={2} h={8} mb={4} justifyContent={"space-between"}>
          <Input
            flex={1}
            onChangeText={onChangeText}
            value={inputValue}
            w={"70%"}
            placeholder="Add a task"
          />
          <IconButton
            icon={<AddIcon size="4" />}
            borderRadius={4}
            variant={"solid"}
            onPress={onTaskAdd}
          />
        </HStack>
      </Box>
      <VStack>
        {tasks.map((task, index) => (
          <HStack
            w="100%"
            h="25"
            justifyContent="space-between"
            key={task.title}
          >
            <Checkbox
              isChecked={task.isCompleted}
              onChange={() => handleStatusChange(index)}
              value={task.title}
              accessibilityLabel={`Task: ${task.title}`}
            />
            <Text
              width="100%"
              flexShrink={1}
              textAlign="left"
              mx="2"
              strikeThrough={task.isCompleted}
            >
              {task.title}
            </Text>
            <IconButton
              size={"sm"}
              colorScheme={"trueGray"}
              icon={<DeleteIcon size="4" color="red.500" />}
              onPress={() => {
                handleDelete(index);
              }}
            ></IconButton>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
