// Mock global para @expo/vector-icons
// Evita que Jest intente cargar expo-font/expo-asset en tests.
const React = require('react');
const Icon = () => null;
module.exports = {
  Ionicons:       Icon,
  Feather:        Icon,
  MaterialIcons:  Icon,
  AntDesign:      Icon,
  FontAwesome:    Icon,
  Entypo:         Icon,
  Octicons:       Icon,
  MaterialCommunityIcons: Icon,
};
