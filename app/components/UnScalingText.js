import React from 'react';
import {Text as NBText} from 'native-base';


 const Text = props => (<NBText allowFontScaling={false} {...props}>{props.children}</NBText>);

 export default Text;