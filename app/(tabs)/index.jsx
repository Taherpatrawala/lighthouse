import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Link } from "expo-router";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  const API_KEY = "76a3b00b83c8438422c7b7eb425b0645";

  const getData = async (currentPage) => {
    if (!hasMorePages) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`
      );

      const newResults = response.data?.results || [];

      // Append new results if it's not the first page
      setData((prevData) =>
        currentPage === 1 ? newResults : [...prevData, ...newResults]
      );

      // Check if we've reached the last page
      setHasMorePages(newResults.length > 0);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Unable to load movies. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const loadMoreMovies = () => {
    if (!loading && hasMorePages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderMovieCard = ({ item }) => {
    const imageUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://via.placeholder.com/500x750.png?text=No+Image";

    return (
      <View
        key={item.id}
        className="mb-6 mx-4 rounded-2xl bg-[#1E1E1E] overflow-hidden shadow-lg"
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-[400px] rounded-t-2xl"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="text-yellow-300 text-2xl font-bold text-center mb-2">
            {item.title}
          </Text>
          <Text
            className="text-white text-center mb-4 h-20 overflow-hidden"
            numberOfLines={3}
          >
            {item.overview}
          </Text>
          <Link href={`../(tabs)/overview/${item.id}`} asChild>
            <TouchableOpacity className="bg-yellow-500 rounded-lg py-3 px-4">
              <Text className="text-black text-center font-bold">
                View Details
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  };

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setPage(1);
            getData(1);
          }}
          className="mt-4 bg-yellow-500 px-4 py-2 rounded"
        >
          <Text className="text-black">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        onScrollEndDrag={(event) => {
          const { contentOffset, layoutMeasurement, contentSize } =
            event.nativeEvent;
          const isNearBottom =
            contentOffset.y + layoutMeasurement.height >=
            contentSize.height - 50;

          if (isNearBottom) {
            loadMoreMovies();
          }
        }}
      >
        {loading && page === 1 ? (
          <View className="flex-1 justify-center items-center h-screen">
            <ActivityIndicator size="large" color="#FFD700" />
          </View>
        ) : (
          <>
            {data.map((movie) => renderMovieCard({ item: movie }))}

            {loading && page > 1 && (
              <View className="my-4 items-center">
                <ActivityIndicator size="large" color="#FFD700" />
              </View>
            )}

            {!loading && !hasMorePages && (
              <View className="my-4 items-center">
                <Text className="text-white">No more movies to load</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
