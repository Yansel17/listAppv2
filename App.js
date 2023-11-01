import React from "react";
import {  Text,  NativeBaseProvider,  Box,} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

//Screen
import TaskList from "./src/TaskList";

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <Box py="4" px="3">
          <TaskList />
        </Box>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
