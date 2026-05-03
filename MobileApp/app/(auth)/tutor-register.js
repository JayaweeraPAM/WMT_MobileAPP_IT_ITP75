import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AuthContext } from '../../src/contexts/AuthContext';
import { authAPI } from '../../src/services/api';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';
import { GlassCard } from '../../src/components/GlassCard';
import { PremiumBlurWrapper } from '../../src/components/PremiumBlurWrapper';

export default function TutorRegisterScreen() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const context = useContext(AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const validatePhone = (phone) => {
    if (!phone) return true;
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 11;
  };

  const handleNext = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in your name, email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (contactPhone.trim() && !validatePhone(contactPhone.trim())) {
      Alert.alert('Invalid Phone', 'Please enter a valid contact number (9-11 digits).');
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!bio.trim()) {
      Alert.alert('Missing Info', 'Please add a brief bio.');
      return;
    }
    try {
      setIsLoading(true);
      const { token, user } = await authAPI.registerTutor({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        contactPhone: contactPhone.trim() || '',
        bio: bio.trim() || '',
        hourlyRate: parseFloat(hourlyRate) || 0,
        location: location.trim() || '',
      });

      if (token && user) {
        if (!context) {
          throw new Error('Auth context is not ready. Please restart the app.');
        }
        await context.login(token, {
          ...user,
          name: user.fullName ?? user.name,
          role: user.role || 'tutor_pending',
        });
        Alert.alert('Welcome!', 'Your tutor account was successfully created.');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Success', 'Your tutor profile has been submitted for admin approval.');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      const msg = error?.message || 'Could not connect to server. Check backend connection.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (f) => [styles.input, focusedField === f && styles.inputFocused];

  return (
    <PremiumBlurWrapper>
      <LinearGradient colors={['#06040f', '#100825', '#06040f']} style={styles.gradient}>
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <GlassCard style={styles.card}>
                <View style={[styles.logoWrap, { flexDirection: 'column', gap: 10 }]}>
                  <LinearGradient colors={['#7C6FFF', '#5B50E8']} style={[styles.logoGrad, { marginRight: 0 }]}>
                    <Text style={styles.logoChar}>T</Text>
                  </LinearGradient>
                  <Text style={styles.logoName}>TutorHub</Text>
                </View>

                <Text style={styles.title}>Tutor Registration</Text>
                <Text style={styles.subtitle}>Step {step} of 2</Text>

                {step === 1 ? (
                  <View style={styles.fields}>
                    <TextInput
                      style={inputStyle('name')}
                      placeholder="Full Name"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TextInput
                      style={inputStyle('email')}
                      placeholder="Email address"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TextInput
                      style={inputStyle('pass')}
                      placeholder="Password (min. 6 characters)"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedField('pass')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TextInput
                      style={inputStyle('phone')}
                      placeholder="Contact Number"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      keyboardType="phone-pad"
                      value={contactPhone}
                      onChangeText={setContactPhone}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />

                    <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
                      <LinearGradient colors={['#7C6FFF', '#5B50E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
                        <Text style={styles.btnText}>Next</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.fields}>
                    <TextInput
                      style={[inputStyle('bio'), { height: 100, textAlignVertical: 'top' }]}
                      placeholder="Bio / About yourself"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      multiline
                      value={bio}
                      onChangeText={setBio}
                      onFocus={() => setFocusedField('bio')}
                      onBlur={() => setFocusedField(null)}
                    />

                    <TextInput
                      style={inputStyle('hourlyRate')}
                      placeholder="Hourly Rate (LKR)"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      keyboardType="numeric"
                      value={hourlyRate}
                      onChangeText={setHourlyRate}
                      onFocus={() => setFocusedField('hourlyRate')}
                      onBlur={() => setFocusedField(null)}
                    />

                    <TextInput
                      style={inputStyle('location')}
                      placeholder="Location / City"
                      placeholderTextColor="rgba(140,140,190,0.45)"
                      value={location}
                      onChangeText={setLocation}
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField(null)}
                    />

                    <TouchableOpacity onPress={handleRegister} disabled={isLoading} activeOpacity={0.85}>
                      <LinearGradient colors={['#7C6FFF', '#5B50E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register as Tutor</Text>}
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setStep(1)} style={[styles.ghostBtn, { marginTop: 12 }]} activeOpacity={0.8}>
                      <Text style={styles.ghostText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {step === 1 && (
                  <TouchableOpacity onPress={() => router.back()} style={styles.ghostBtn} activeOpacity={0.8}>
                    <Text style={styles.ghostText}>Back to Sign In</Text>
                  </TouchableOpacity>
                )}
              </GlassCard>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </PremiumBlurWrapper>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  blobTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(100,60,220,0.18)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(30,90,220,0.14)',
  },
  card: {
    padding: Spacing.xl,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  logoGrad: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#7C6FFF',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  logoChar: { fontSize: 24, fontWeight: '800', color: '#fff' },
  logoName: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  fields: { marginBottom: Spacing.sm },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputFocused: { borderColor: 'rgba(124,111,255,0.55)', backgroundColor: 'rgba(255,255,255,0.09)' },
  btn: {
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#7C6FFF',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600', letterSpacing: 0.3 },
  ghostBtn: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ghostText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '500' },
});
