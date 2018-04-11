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
//utils
import Colors from '../utils/Colors';
import GLOBAL_PARAMS from '../utils/global_params';
import ToastUtil from '../utils/ToastUtil';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class ConfirmOrderView extends PureComponent {
    _popupDialog = null;
    state = {
        _name: '',
        _phone: ''
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
                <Form>
                    <Item floatingLabel>
                        <Label>訂餐人姓名</Label>
                        <Input ref={(t) => this._username = t}/>
                    </Item>
                    <Item floatingLabel last>
                        <Label>取餐電話號碼</Label>
                        <Input ref={(f) => this._phone = f}/>
                    </Item>
                </Form>
            </View>
        </PopupDialog>
    )

    render() {
        return (
            <Container>
                {this._renderPopupDiaogView()}
                <CommonHeader canBack title="訂單詳情頁" textColor={Colors.fontBlack}
                              headerStyle={{backgroundColor: Colors.main_white, borderBottomWidth: 0,}}
                              iosBarStyle="dark-content"
                              titleStyle={{fontSize: 18, fontWeight: 'bold',}}
                              {...this['props']}/>
                <Content style={{backgroundColor: Colors.main_white}} padder>
                    <Card>
                        <CardItem style={{backgroundColor: '#fafafa'}}>
                            <Body style={{borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10}}>
                            <Text style={styles.commonTitleText}>
                                Michelin-Recommended Mie{'\n'}
                                Gomak | 米芝蓮推介 印尼椰汁咖喱雞肉炒麵 HKD 89.00
                            </Text>
                            <Text style={styles.commonDecText}>Quantity: 1</Text>
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
                                <Text style={styles.commonPriceText}>HKD 89.0</Text>
                            </View>
                            </Body>
                        </CardItem>
                    </Card>
                    <View style={{padding: 5}}>
                        <Text style={styles.commonDetailText}>Delivery Details</Text>
                        <Form style={{marginLeft: -15}}>
                            <Item stackedLabel>
                                <Label style={styles.commonLabel}>訂餐人姓名 <Text>(必填)</Text></Label>
                                <Input placeholderTextColor="#777777" multiline={false}
                                       onChangeText={name => this._getName(name)}/>
                            </Item>
                            <Item stackedLabel>
                                <Label style={styles.commonLabel}>聯繫電話</Label>
                                <Input placeholderTextColor="#777777" multiline={false}
                                    onChangeText={phone => this._getPhone(phone)}/>
                            </Item>
                            <Item stackedLabel>
                                <Label style={styles.commonLabel}>取餐日期</Label>
                                <Input placeholder="Tomorrow afternoon" disabled placeholderTextColor="#777777"/>
                            </Item>
                            <Item stackedLabel>
                                <Label style={styles.commonLabel}>選擇點</Label>
                                <Input placeholder="Three Exchange Square" disabled placeholderTextColor="#777777"/>
                            </Item>
                            <Item stackedLabel>
                                <Label style={styles.commonLabel}>取餐點</Label>
                                <Input placeholder="Exchange Square There Pedestrian Bridge" disabled
                                       placeholderTextColor="#777777"/>
                            </Item>
                            <Item stackedLabel>
                                <Label style={styles.commonLabel}>取餐時間</Label>
                                <Input placeholder="~ 12:00-12:30 (we'll send you a Push Noti)" disabled
                                       placeholderTextColor="#777777"/>
                            </Item>
                        </Form>
                    </View>
                </Content>
                <Footer style={{borderTopWidth: 0}}>
                    <Button onPress={() => this._onSubmit()} block style={{flex: 1,marginTop:5,backgroundColor: '#3B254B', marginLeft: 40, marginRight: 40}}>
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

