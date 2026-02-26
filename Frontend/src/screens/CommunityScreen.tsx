import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Teera Community</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Post Card */}
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.userName}>Ranjith Perera</Text>
          <Text style={styles.time}>5h ago</Text>
        </View>

        <Text style={styles.postText}>
          Leaves are turning yellow with brown spots. Some leaves are drying and falling off.
          The plant growth has reduced and the disease is spreading to nearby plants.
        </Text>
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  postContainer: {
    padding: 20,
  },

  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
  },

  time: {
    fontSize: 12,
    color: "gray",
  },

  postText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#8BE28B",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});