import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import React from "react";
import background from "@/assets/images/background.jpg";
const index = () => {
  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      className="flex-1 items-center justify-center"
    >
      <View className="flex-1 items-center justify-center w-100v h-100v">
        <View className="rounded-xl shadow-lg">
          <Text className="text-3xl text-yellow-500 font-mono font-bold m-3 bg-black p-3 w-[100vw] opacity-90">
            Welcome to Lighthouse!!
          </Text>
        </View>
        <Link
          href="/(tabs)"
          className="text-3xl text-yellow-500 m-3 rounded-md py-3 w-40 "
          asChild
        >
          <TouchableOpacity className="bg-[#1E1E1E] ">
            <Text className="text-center text-xl text-yellow-400 font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
};

export default index;
