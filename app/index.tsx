import {
  View,
  TextInput,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPesoSign } from "@fortawesome/free-solid-svg-icons/faPesoSign";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import sampleData from "../data/sampleData.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/service/redux/store";
import { addFigure, deleteFigure } from "@/service/redux/slice";

const windowWidth = Dimensions.get("window").width;

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const figures = useSelector((state: RootState) => state.figures.figures);

  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsgVisible, setModalMsgVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [resizeMode, setResizeMode] = useState<"contain" | "cover">("contain");

  const [type, setType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleAddFigure = () => {
    if (name && price && image) {
      dispatch(
        addFigure({
          id: Date.now(),
          name,
          price: Number(price),
          image: { uri: image },
        })
      );
      setModalVisible(false);
      setName("");
      setPrice("");
      setImage(null);
      setType("success");
      setModalMsgVisible(true);
      setTimeout(() => {
        setModalMsgVisible(false);
      }, 2000);
    } else {
      alert("Please fill out all fields and select an image.");
    }
  };

  const filteredFigures = figures.filter(figure =>
    figure.name.toLowerCase().includes(searchQuery)
  );

  const renderItem = ({ item }: any) => {
    const animatedValue = new Animated.Value(1);

    const handleDelete = (id: number) => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        dispatch(deleteFigure(id));
      });

      setType("deleted");
      setModalMsgVisible(true);

      setTimeout(() => {
        setModalMsgVisible(false);
      }, 2000);
    };

    return (
      <Animated.View
        className="p-3 shadow-lg rounded-2xl w-[48.5%] bg-white text-green-700"
        style={{
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          overflow: "hidden",
          backgroundColor: "#ffffff",
          padding: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          borderRadius: 16,
          width: "48.5%",
        }}
      >
        <Image
          source={item.image}
          style={{
            width: "auto",
            height: windowWidth * 0.4,
            resizeMode: "cover",
            backgroundColor: "#f8fafc",
          }}
        />
        <View className="flex flex-row">
          <View className="flex-1">
            <Text className="text-base mt-3 font-medium ">{item.name}</Text>
            <View className="flex w-[100%] flex-row items-center">
              <FontAwesomeIcon
                icon={faPesoSign}
                size={10}
                style={{ marginTop: 10, color: "#ca8a04" }}
              />
              <Text className="text-2xl font-medium text-yellow-600">
                {item.price.toLocaleString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="justify-center"
            onPress={() => handleDelete(item.id)}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              size={20}
              style={{
                marginTop: 10,
                color: "#7f1d1d",
                marginRight: 6,
                marginLeft: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      className="align-middle  overflow-auto h-screen"
      source={require("../assets/images/bg-home.jpg")}
      imageStyle={{
        height: "100%",
        width: "100%",
        opacity: 0.2,
      }}
    >
      <View className="flex-1 overflow-auto h-screen p-2 text-red-900 ">
        <View className="flex items-center mt-5">
          <Image
            source={require("../assets/images/figure-logo.png")}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
        </View>
        <Text className="font-bold text-3xl text-center py-3 text-slate-800">
          Welcome to Collectible Figures Manager!
        </Text>

        <View
          className="font-medium text-lg text-center text-black shadow-lg  rounded-lg"
          style={{
            marginVertical: 20,
            paddingHorizontal: 30,
            paddingVertical: 30,
            backgroundColor: "rgba(255, 223, 150, 0.7)",
          }}
        >
          Keep your collection organized and at your fingertips!
          <Text className="text-center mt-4 font-medium">
            Add new figures, update details, and search your collection with
            ease. Whether you're a casual collector or a dedicated enthusiast,
            this app helps you track, manage, and showcase your figures
            effortlessly.
          </Text>
        </View>

        <View>
          <View className="relative my-5">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={20}
              style={{
                marginTop: 10,
                color: "#1e40af",
                marginRight: 6,
                position: "absolute",
                left: 22,
                top: 1,
                transform: "-translate-y-1/2",
              }}
            />
            <TextInput
              onChangeText={handleSearch}
              placeholder="Search"
              className="py-2 px-14 rounded-full text-lg border-2 shadow-lg border-blue-800 text-gray-700 font-bold bg-blue-100 bg-"
            />
          </View>
        </View>
        <View className="flex flex-row items-center w-full justify-center gap-5 mb-5">
          <Text
            className="text-center text-lg font-bold bg-red-950 py-3 px-5 text-white rounded-xl shadow-lg cursor-pointer"
            onPress={() => setModalVisible(true)}
          >
            Add Collection
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalMsgVisible}
          onRequestClose={() => setModalMsgVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 30 }}
              >
                <View
                  className="bg-white p-5 rounded-lg w-4/5"
                  style={{
                    width: "90%",
                    maxWidth: 400,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 5,
                  }}
                >
                  <Text className="text-2xl font-bold text-center m-5">
                    {type === "success" ? "Success!" : "Deleted!"}
                  </Text>

                  <View className="w-full items-center my-4 ">
                    <Image
                      source={
                        type === "success"
                          ? require("../assets/images/success.gif")
                          : require("../assets/images/deleted.gif")
                      }
                      style={{ width: 200, height: 200, borderRadius: 5 }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      marginVertical: 20,
                      marginHorizontal: 25,
                    }}
                  >
                    <Text
                      style={{
                        color: "#00000",
                        fontWeight: "600",
                        fontSize: 18,
                        textAlign: "center",
                      }}
                    >
                      {type === "success"
                        ? "The figure details have been successfully added"
                        : "The figure details have been successfully removed"}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 30 }}
              >
                <View
                  className="bg-white p-5 rounded-lg w-4/5"
                  style={{
                    width: "90%",
                    maxWidth: 400,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 5,
                  }}
                >
                  <Text className="text-2xl font-bold text-center m-5">
                    Submit Your Details
                  </Text>

                  <View className="w-full items-center my-4 ">
                    {image ? (
                      <Image
                        source={{ uri: image }}
                        style={{
                          width: 200,
                          height: 200,
                          borderRadius: 10,
                          marginBottom: 20,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../assets/images/def-image-form.png")}
                        style={{ width: 200, height: 200, borderRadius: 10 }}
                      />
                    )}
                  </View>

                  <View style={{ marginVertical: 20, marginHorizontal: 25 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderWidth: 1,
                        borderColor: "#D1D5DB",
                        borderRadius: 8,
                        alignItems: "center",
                        backgroundColor: "#450a0a",
                      }}
                      onPress={pickImage}
                    >
                      <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                        Select Figurine Image
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginHorizontal: 25, marginBottom: 20 }}>
                    <TextInput
                      placeholder="Enter Name"
                      value={name}
                      onChangeText={setName}
                      style={{
                        borderWidth: 1,
                        borderColor: "#D1D5DB",
                        padding: 14,
                        borderRadius: 8,
                        marginBottom: 15,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                    <TextInput
                      placeholder="Enter Price"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={text => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setPrice(numericValue);
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: "#D1D5DB",
                        padding: 10,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 16,
                      width: "100%",
                      paddingHorizontal: 25,
                      marginBottom: 30,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderWidth: 1,
                        borderColor: "#D1D5DB",
                        borderRadius: 8,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={{ color: "#94A3B8", fontWeight: "600" }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <View style={{ width: 5 }} />

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderWidth: 1,
                        borderColor: "#15803d",
                        borderRadius: 8,
                        alignItems: "center",
                        backgroundColor: "#15803d",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                      onPress={handleAddFigure}
                    >
                      <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        <SafeAreaProvider>
          <SafeAreaView>
            <FlatList
              className="flex"
              data={filteredFigures}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                gap: 10,
                marginBottom: 10,
                marginLeft: "1.2%",
              }}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              ListEmptyComponent={
                <View className="h-full flex items-center">
                  <Image
                    source={require("../assets/images/empty-gif.gif")}
                    style={{ width: "50%", marginTop: 50 }}
                  />
                  <Text className="text-center text-2xl  font-semibold text-gray-600 mt-10">
                    No collection available 😢
                  </Text>
                </View>
              }
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    </ImageBackground>
  );
};

export default Index;
