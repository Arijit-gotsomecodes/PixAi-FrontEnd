import { View, FlatList, Dimensions } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import ImagedCarouselCard from 'react-native-imaged-carousel-card';

const { width } = Dimensions.get('window');
const images = [
  require('./../../assets/images/banners (1).png'),
  require('./../../assets/images/banners (2).png'),
  require('./../../assets/images/banners (3).png'),
  require('./../../assets/images/banners (4).png'),
  require('./../../assets/images/banners (5).png'),
  require('./../../assets/images/banners (6).png'),
];

export default function Banner() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (currentIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <FlatList
      ref={flatListRef}
      data={images}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      snapToInterval={width - 60 + 20} // Increased size
      decelerationRate="fast"
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginTop: 20 }}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View key={index} style={{ width: width - 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
          <ImagedCarouselCard
            width={width - 50}
            height={width * 1.3} // Increased height
            source={item}
            text={null} // Completely remove text overlay
            overlayBackgroundColor="transparent"
            shadowColor={'#000'}
            shadowStyle={{ shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 }}
          />
        </View>
      )}
      onMomentumScrollEnd={(event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / (width - 60 + 20));
        setCurrentIndex(index);
      }}
      getItemLayout={(data, index) => ({ length: width - 60 + 20, offset: (width - 60 + 20) * index, index })}
    />
  );
}
