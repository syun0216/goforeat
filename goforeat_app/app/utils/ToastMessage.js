const Message = {
  login_tips: {
    success: {
      code: '驗證碼發送成功',
      login: '登錄成功'
    },
    fail: {
      phone_format: '手機號格式有誤',
      phone_null: '請填寫手機號',
      code: '驗證碼發送失敗',
      code_null: '請填寫驗證碼',
      login: '登錄失敗',
    }
  },
  setting_tips: {
    success: {
      logout: '登出成功'
    },
    fail: {
      logout: '登出失敗',
      logout_network: '登出失敗,請檢查網絡'
    }
  },
  linking_tips: {
    fail: {
      not_support: '不支持撥打電話',
      call: '撥打用戶號碼失敗'
    }
  },
  article_tips: {
    fail: {
      load: '加載文章失敗'
    }
  },
  confirmorder_tips: {
    success: {
      order: '下單成功',
      coupon: '優惠成功'
    },
    fail: {
      get_order: '獲取訂單信息失敗',
      confirm_order: '確認訂單失敗',
      order: '下單失敗',
      coupon_null: '請輸入優惠碼',
      coupon_used: '您已經優惠過了',
      get_coupon: '獲取優惠失敗'
    }
  },
  myorder_tips: {
    success: {
      cancel_order: '取消訂單成功'
    }
  },
  common_tips: {
    err: '發生未知錯誤',
    network_err: '网络請求失敗',
    no_network: '網絡飛走了...',
    no_auth: '請先登錄哦',
    no_function: '該功能暫未開放'
  }
};

module.exports = Message;