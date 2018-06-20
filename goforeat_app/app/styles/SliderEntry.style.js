import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.70;
const slideWidth = wp(83);
const itemHorizontalMargin = wp(1);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: 262*(viewportHeight/667),
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18, // needed for shadow
        // backgroundColor: '#fff'
    },
    shadow: {
        // position: 'absolute',
        // top: 0,
        // left: itemHorizontalMargin,
        // right: itemHorizontalMargin,
        // bottom: 18,
        // shadowColor: colors.black,
        // shadowOpacity: 0.25,
        // shadowOffset: { width: 0, height: 50 },
        // shadowRadius: 10,
        // borderRadius: entryBorderRadius
    },
    imageContainer: {
        height: 250*(viewportHeight/667),
        // marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        shadowColor: '#c5bbd0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: entryBorderRadius,
        elevation: 6,
        borderRadius: entryBorderRadius,
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius:  entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    // radiusMaskEven: {
    //     backgroundColor: colors.black
    // },
    textContainer: {
        justifyContent: 'center',
        // paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius,
        minHeight: 120
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 16,
        fontStyle: 'italic',
        textAlign:'justify'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});
