import React, {PureComponent} from 'react'
import {View, Text, StyleSheet,TextInput} from 'react-native';
import {
    Container,
    Content,
    Button,
    Icon,
    Card,
    CardItem,
    Body,
    Left,
    Right,
    IconNB,
    Form,
    Item,
    Input,
    Label,
    Footer
} from 'native-base';
import PopupDialog, {SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
//components
import CommonHeader from '../components/CommonHeader';
import BlankPage from '../components/BlankPage';
import Loading from '../components/Loading';
import ErrorPage from '../components/ErrorPage';
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';
//api
import api from '../api/index';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class ConfirmOrderView extends PureComponent {
    _popupDialog = null;
    state = {
        _name: '',
        _phone: '',
        orderDetail: null,
        loading: true,
        isError: false,
        isExpired: false
    }

    componentDidMount() {
        this._createOrder();
    }

    componentWillReceiveProps(a,b) {
        console.log(a,b)
    }

    _createOrder = () => {
        api.createOrder(this.props.navigation.state.params.foodId).then(data => {
            console.log(data);
            if(data.status === 200 && data.data.ro.ok) {
                this.setState({
                    orderDetail: data.data.data
                })
            }else {
                this.props.screenProps.userLogout();
                alert(data.data.ro.respMsg);
                this.setState({
                    isExpired: true,
                    expiredMessage: data.data.ro.respMsg
                });
            }
        },() => {
            ToastUtil.showWithMessage("獲取訂單信息失敗")
        })
    }

    _confirmOrder = () => {
        if(this.state.orderDetail === null) {
            ToastUtil.showWithMessage("確認訂單失敗");
            return;
        }
        api.confirmOrder(this.state.orderDetail.orderId).then(data => {
            console.log(data);
            if(data.status === 200 && data.data.ro.ok) {
                ToastUtil.showWithMessage("下單成功");
                this.props.navigation.goBack();
            }else{
                ToastUtil.showWithMessage(data.data.ro.respMsg);
            }
        },() => {
            ToastUtil.showWithMessage("下單失敗");
        })
    }

    //private function
    _openDialog = () => {
        this._popupDialog.show(() => {
            // console.log('opened!')
        })
    }

    _getName = (name) => {
        this.setState({
            _name: name
        })
    }

    _getPhone = (phone) => {
        this.setState({
            _phone: phone
        })
    }

    _onSubmit = () => {
        if(this.state._name === '') {
            ToastUtil.showWithMessage("請訂餐人姓名");
            return;
        }
        if(this.state._phone === '') {
            ToastUtil.showWithMessage('請填寫聯繫人電話');
            return ;
        }
    }

    _renderPopupDiaogView = () => (
        <PopupDialog
            dialogTitle={<DialogTitle title="Dialog Title" />}
            width={GLOBAL_PARAMS._winWidth * 0.8}
            // height={220}
            ref={(popupDialog) => {
                this._popupDialog = popupDialog;
            }}
            dialogAnimation={slideAnimation}
            onDismissed={() => {console.log(this._username)}}
        >
            <View style={{flex: 1}}>
                <Text>下單成功</Text>
            </View>
        </PopupDialog>
    )

    _renderOrderView = () => {
        let {orderDetail} = this.state;
        return (<View>
            <Card>
                <CardItem style={{backgroundColor: '#fafafa'}}>
                    <Body style={{borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10}}>
                    <Text style={styles.commonTitleText}>
                        {orderDetail.orderDetail[0].foodName} {'\n'}
                        HKD {orderDetail.orderDetail[0].foodMoney}
                    </Text>
                    <Text style={styles.commonDecText}>Quantity: {orderDetail.orderDetail[0].foodNum}</Text>
                    </Body>
                </CardItem>
                <CardItem style={{backgroundColor: '#fafafa', marginTop: -10}}>
                    <Body>
                    {/*<Text style={styles.commonTitleText}>*/}
                    {/*NativeBase builds a layer on top of React Native that provides*/}
                    {/*you with*/}
                    {/*</Text>*/}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={styles.commonDecText}>TOTAL</Text>
                        <Text style={styles.commonPriceText}>HKD {orderDetail.totalMoney}</Text>
                    </View>
                    </Body>
                </CardItem>
            </Card>
            <View style={{padding: 5}}>
                <Text style={styles.commonDetailText}>Delivery Details</Text>
                <Form style={{marginLeft: -15}}>
                    <Item stackedLabel>
                        <Label style={styles.commonLabel}>取餐日期</Label>
                        <Input placeholder={orderDetail.takeDate} disabled placeholderTextColor="#777777"/>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.commonLabel}>選擇點</Label>
                        <Input placeholder={orderDetail.takeAddress} disabled placeholderTextColor="#777777"/>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.commonLabel}>取餐點</Label>
                        <Input placeholder={orderDetail.takeAddressDetail} disabled
                               placeholderTextColor="#777777"/>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.commonLabel}>取餐時間</Label>
                        <Input placeholder={orderDetail.takeTime} disabled
                               placeholderTextColor="#777777"/>
                    </Item>
                </Form>
            </View>
        </View>
    )}

    render() {
        return (
            <Container>
                {this._renderPopupDiaogView()}
                {this.state.isLoading ? <Loading /> : null}
                {this.state.isError ? <ErrorPage errorToDo={this._createOrder()}/> : null}
                <CommonHeader canBack title="訂單詳情頁" textColor={Colors.fontBlack}
                              headerStyle={{backgroundColor: Colors.main_white, borderBottomWidth: 0,}}
                              iosBarStyle="dark-content"
                              titleStyle={{fontSize: 18, fontWeight: 'bold',}}
                              {...this['props']}/>
                <Content style={{backgroundColor: Colors.main_white}} padder>
                    {this.state.isExpired ? <BlankPage message={this.state.expiredMessage}/> : null}
                    {this.state.orderDetail !== null ? this._renderOrderView() : null}
                </Content>
                <Footer style={{borderTopWidth: 0,backgroundColor: Colors.main_white}}>
                    <Button onPress={() => this._confirmOrder()} block style={{flex: 1,marginTop:5,backgroundColor: '#3B254B', marginLeft: 40, marginRight: 40}}>
                        <Text style={{color: Colors.main_white, fontWeight: '600', fontSize: 16}}>確認訂單</Text>
                    </Button>
                </Footer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    commonTitleText: {
        fontSize: 16, color: '#3B254B',
        fontWeight: 'bold',
        fontFamily: 'AvenirNext-UltraLightItalic',
    },
    commonDecText: {
        // fontFamily: 'AvenirNext-UltraLightItalic',
        color: Colors.fontBlack,
        fontWeight: 'normal',
        fontSize: 16,
        // marginTop: 5,
        flex: 1
    },
    commonPriceText: {
        color: '#3B254B',
        fontWeight: 'bold',
        fontSize: 16,
        // marginTop: 5,
    },
    commonDetailText: {
        fontWeight: '700',
        color: Colors.fontBlack,
        fontSize: 20,
        // fontFamily:'AvenirNext-Regular',
        // textShadowColor:'#C0C0C0',
        // textShadowRadius:2,
        // textShadowOffset:{width:2,height:2},
    },
    commonLabel: {
        letterSpacing: 2,
        fontWeight: '200',
        color: Colors.fontBlack
    }
})

