import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import {useToast} from "react-native-toast-notifications";
import {useCartStore} from "../../store/cart-store";
import {useState} from "react";
import {getProduct} from "../../api/api";

const ProductDetails = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const toast = useToast();
    const { data: product, error, isLoading } = getProduct(slug);
    const { items, addItem, incrementItem, decrementItem } = useCartStore();
    const cartItem = items.find(item => item.id === product.id);
    const initialQuantity = cartItem ? cartItem.quantity : 1;
    const [quantity, setQuantity] = useState<number>(initialQuantity);

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error: {error.message}</Text>;
    if (!product) return <Redirect href='/404' />;

    const increaseQuantity = () => {
        if (quantity < product.maxQuantity) {
            setQuantity(prev => prev + 1);
            incrementItem(product.id);
        } else {
            toast.show('Cannot add more than maximum quantity!.', {
                type: 'warning',
                placement: "top",
                duration: 1500,
            });
        }
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
            decrementItem(product.id);
        }
    };
    const addToCart = () => {
        addItem({
            id: product.id,
            title: product.title,
            // @ts-ignore
            heroImage: product.heroImage,
            price: product.price,
            quantity,
            maxQuantity: product.maxQuantity,
        });
        toast.show('Added to cart!.', {
            type: 'success',
            placement: "top",
            duration: 1500,
        });
    };
    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: product.title }} />
            <Image
                // @ts-ignore
                source={{ uri: product.heroImage }} style={styles.heroImage} />
            <View style={{ padding: 16, flex: 1 }}>
                <Text style={styles.title}>Title: {product.title}</Text>
                <Text style={styles.slug}>Slug: {product.slug}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        Unit Price: R$ {product.price.toFixed(2)}
                    </Text>
                    <Text style={styles.price}>Total Price: R$ {totalPrice}</Text>
                </View>

                <FlatList
                    data={product.imagesUrl}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <Image
                            // @ts-ignore
                            source={{ uri: item }} style={styles.image} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageContainer}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        // @ts-ignore
                        onPress={decreaseQuantity}
                        disabled={quantity <= 1}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        // @ts-ignore
                        onPress={increaseQuantity}
                        disabled={quantity >= product.maxQuantity}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.addToCartButton,
                            { opacity: quantity === 0 ? 0.5 : 1 },
                        ]}
                        onPress={addToCart}
                        disabled={quantity === 0}
                    >
                        <Text style={styles.addToCartText}>Add To Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

export default ProductDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    heroImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 8,
    },
    slug: {
        fontSize: 18,
        color: "#555",
        marginBottom: 16,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    price: {
        fontWeight: "bold",
        color: "#000",
    },
    imageContainer: {
        marginBottom: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#007BFF",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
    },
    quantityButtonText: {
        fontSize: 24,
        color: "#FFF",
    },
    quantity : {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 16,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: "#28A745",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
    },
    addToCartText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorMessage: {
        fontSize: 18,
        color: "#F00",
        textAlign: "center",
        marginTop: 20,
    },
});