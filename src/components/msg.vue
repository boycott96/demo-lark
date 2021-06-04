<template>
  <div class="msg">
    <a-button type="primary" class="button" @click="sendMsg">
      发送消息卡片。进行确认操作
    </a-button>
  </div>
</template>
<script>
import { getAccessToken, sendMsgCard } from "../lark.service";
import cardJson from "../card.json";
export default {
  name: "Msg",
  data() {
    return {
      form: {
        app_id: "cli_a0262feb4ffad00e",
        app_secret: "RgQ8WdjVPQBOJHKY7lh3hcm5ViijTdr4",
      },
      websock: null,
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close();
  },
  methods: {
    initWebSocket() {
      const url = "ws://localhost:8082/websocket";
      this.websock = new WebSocket(url);
      this.websock.onmessage = this.websocketOnMessage;
      this.websock.onopen = this.websocketOnOpen;
      this.websock.onError = this.websocketOnError;
      this.websock.onClose = this.websocketOnClose;
    },
    websocketOnMessage() {
      let actions = {"test": "12345"};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketOnOpen() {},
    websocketOnError() {},
    websocketOnClose() {},
    sendMsg () {
      getAccessToken(this.form).then((res) => {
        // 得到apptoken
        let data = res.data;
        if (data.code === 0) {
          this.$message.success("成功获取APP_ACCESS_TOKEN");
          let app_access_token = data.app_access_token;
          let headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + app_access_token,
          };
          let params = {
            open_id: "ou_24b3c9fec359d227f05caa487ec08692", // 机器人聊天的id
            msg_type: "interactive",
            card: cardJson,
          };
          sendMsgCard(params, headers).then((res) => {
            console.log(res);
          });
        } else {
          this.$message.success(data.message);
        }
      });
    },
  },
};
</script>
<style scoped>
.msg {
  padding: 64px;
}
</style>