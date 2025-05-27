import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import styles from '../../styles/SkeletonItemStyles';

const SkeletonItem = () => {
  const theme = useThemeStore((state) => state.theme);
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.image,
          { backgroundColor: theme.borderColor, opacity },
        ]}
      />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.title,
            { backgroundColor: theme.borderColor, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.price,
            { backgroundColor: theme.borderColor, opacity },
          ]}
        />
      </View>
    </View>
  );
};

export default SkeletonItem;
