// types.ts
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
};

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type {
  RootStackParamList,
  LoadingScreenNavigationProp,
  LoginScreenNavigationProp,
  SignUpScreenNavigationProp,
  HomeScreenNavigationProp,
};
