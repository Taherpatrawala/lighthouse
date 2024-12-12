import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableHighlight,
} from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

const Overview = () => {
  const { id } = useLocalSearchParams();
  const [movieDetailsData, setMovieDetailsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "76a3b00b83c8438422c7b7eb425b0645";
  const URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

  const getMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      setMovieDetailsData(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      setError("Unable to load movie details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={"#FFD700"} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  if (!movieDetailsData) return null;

  const {
    title,
    overview,
    poster_path,
    backdrop_path,
    genres,
    runtime,
    vote_average,
    release_date,
    tagline,
  } = movieDetailsData;

  const imgUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://via.placeholder.com/500x750.png?text=No+Image";

  const imgUrlLg = backdrop_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://via.placeholder.com/500x281.png?text=No+Backdrop";

  console.log("smtg");

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="relative">
        <Link href="/(tabs)" asChild>
          <TouchableOpacity className="absolute top-12 left-4 z-40">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <Image
          source={{ uri: imgUrlLg }}
          className="w-full h-[50vh] opacity-50"
          resizeMode="cover"
        />
        <Image
          source={{ uri: imgUrl }}
          className="absolute bottom-[-50px] left-4 w-48 h-72 rounded-lg border-2 border-white"
          resizeMode="cover"
        />
      </View>

      <TouchableOpacity
        className="absolute right-5 bottom-1/2 border border-red-500 rounded-full"
        onPress={() => {
          alert("Added to wishlist");
        }}
      >
        <View className="p-2">
          <Ionicons name="heart" size={24} color="red" />
        </View>
      </TouchableOpacity>

      <View className="p-4 mt-24">
        <Text className="text-white text-3xl font-bold mb-2">{title}</Text>

        {tagline && (
          <Text className="text-gray-400 italic mb-4">"{tagline}"</Text>
        )}

        <View className="flex-row space-x-4 mb-4">
          {genres &&
            genres.map((genre) => (
              <View
                key={genre.id}
                className="bg-gray-700 px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs">{genre.name}</Text>
              </View>
            ))}
        </View>

        <View className="bg-gray-800 p-4 rounded-lg mb-4">
          <Text className="text-white text-base">{overview}</Text>
        </View>

        <View className="flex-row justify-between bg-gray-800 p-4 rounded-lg">
          <View>
            <Text className="text-gray-400">Runtime</Text>
            <Text className="text-white">{runtime} min</Text>
          </View>
          <View>
            <Text className="text-gray-400">Release Date</Text>
            <Text className="text-white">
              {new Date(release_date).toLocaleDateString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-400">Rating</Text>
            <Text className="text-white">{vote_average.toFixed(1)}/10</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Overview;
