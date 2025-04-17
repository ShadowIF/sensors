import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

const ManualIpInput = () => {
    const router = useRouter();
    const [ ipAddress, setIpAddress ] = useState('192.168.1.44');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected ❌');

    const connectToIp = () => {
        const ws = new WebSocket(`ws://${ipAddress}/ws`);

        ws.onopen = () => {
            setConnectionStatus('Connected ✅');
            console.log('Connected to WebSocket at IP:', ipAddress);
        };

        ws.onclose = () => setConnectionStatus('Disconnected ❌');
        ws.onerror = () => {
            setConnectionStatus('Error ❌');
        };

        return () => ws.close();
    };

    return (
        <View style={styles.manualInputContainer}>
            <Text style={styles.inputLabel}>Enter IP Address:</Text>
            <TextInput
                style={styles.textInput}
                placeholder="192.168.x.x"
                value={ipAddress}
                onChangeText={setIpAddress}
            />
            <Button title="Connect" onPress={() => {
                connectToIp();
                router.push({ pathname: '/', params: { ipAddress }}); }} />
            <Text style={styles.status}>Connection Status: {connectionStatus}</Text>
        </View>
    );
};

export default ManualIpInput;

const styles = StyleSheet.create({
    manualInputContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FDEDACFF' },
    inputLabel: { fontSize: 18, color: '#333', marginBottom: 10 },
    textInput: { width: '80%', height: 40, borderColor: '#999', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 , backgroundColor: '#E3CCB2' },
    status: { fontSize: 16, color: '#696969', marginTop: 10 },
});
