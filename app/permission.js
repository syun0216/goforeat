import { NavigationActions } from "react-navigation";
import store from "./store/index";

/**
 * 用于登录验证拦截
 *
 * @export
 * @param {*} action
 * @param {*} state
 * @returns
 */
export function AuthInterceptor(action, state) {
    const authRoutes = [
        "MyOrderDrawer",
        "Order",
        "PayTypeDrawer",
        "CouponDrawer",
        "Credit",
        "Manage_Card",
        "UserInfoDrawer",
        "Coupon",
        "MyOrder",
        "PayType",
        "UserInfo",
        "MonthTicket",
        "MonthTicketDrawer"
    ];
    if (state && action.type == NavigationActions.NAVIGATE) {
        return (
            authRoutes.indexOf(action.routeName) > -1 &&
            store.getState().auth.username == null
        );
    } else {
        return false;
    }
}