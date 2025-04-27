import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useLocalSearchParams } from "expo-router";

export default function App() {
  const params = useLocalSearchParams();
  const ipAddress = params.ipAddress as string;
  const [wsConnected, setWsConnected] = useState(false);
  const [temperaturedht, setTemperaturedht] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [altitude, setAltitude] = useState(0);

  useEffect(() => {
    if (!ipAddress) return;
    const ws = new WebSocket(`ws://${ipAddress}/ws`);

    ws.onopen = () => {
      setWsConnected(true);
      console.log("Connected to ESP WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.temperaturedht) setTemperaturedht(data.temperaturedht);
      if (data.temperature) setTemperature(data.temperature);
      if (data.humidity) setHumidity(data.humidity);
      if (data.pressure) setPressure(data.pressure);
      if (data.altitude) setAltitude(data.altitude);
    };

    ws.onclose = () => setWsConnected(false);

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    return () => ws.close();
  }, [ipAddress]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>🌼 Cute Weather App 🌼</Text>
      <Text style={styles.status}>
        WebSocket:{" "}
        {wsConnected ? "Connected ✅ IP: " + ipAddress : "Disconnected ❌"}
      </Text>
      <View style={styles.gridContainer}>
        <Gauge
          title="Temperature in (°C)"
          value={wsConnected ? temperaturedht : 0}
          max={50}
          color="#006294FF"
        />
        <Gauge
          title="Humidity (%)"
          value={wsConnected ? humidity : 0}
          max={100}
          color="#87CEEB"
        />
        <Gauge
          title="Temperature out (°C)"
          value={wsConnected ? temperature : 0}
          max={50}
          color="#FF0080FF"
        />
        <Gauge
          title="Pressure (hPa)"
          value={wsConnected ? pressure : 0}
          max={1200}
          color="#FFD700"
        />
        <Gauge
          title="Altitude (m)"
          value={wsConnected ? altitude : 0}
          max={2200}
          color="#32CD32"
        />
      </View>
    </ScrollView>
  );
}

type GaugeProps = {
  title: string;
  value: number;
  max: number;
  color: string;
};

const Gauge: React.FC<GaugeProps> = ({ title, value, max, color }) => (
  <View style={styles.gaugeContainer}>
    <Text style={styles.label}>{title}</Text>
    <AnimatedCircularProgress
      size={120}
      width={10}
      fill={(value / max) * 100}
      tintColor={color}
      backgroundColor="#EEE"
    >
      {() => <Text style={styles.value}>{value}</Text>}
    </AnimatedCircularProgress>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: "#FDEDACFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF45A2FF",
    marginBottom: 20,
  },
  status: { fontSize: 16, color: "#696969", marginBottom: 20 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  gaugeContainer: {
    width: "44%",
    margin: 10,
    backgroundColor: "#FDF5E6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A5ACD",
    marginBottom: 10,
  },
  value: { fontSize: 18, fontWeight: "bold", color: "#333333", marginTop: 10 },
});
