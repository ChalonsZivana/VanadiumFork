import OneSignal from "@onesignal/node-onesignal";

const ONESIGNAL_APP_ID = '8c47c8d7-2816-439b-8b07-59217c8431a6';

const app_key_provider = {
  getToken() {
      return 'YTNkZGQ1N2QtZmFiMy00NjgxLWJkNDEtMmVlMjg1NDA0Mjhl';
  }
};
const configuration = OneSignal.createConfiguration({
  authMethods: {
      app_key: {
        tokenProvider: app_key_provider
      }
  }
});
const client = new OneSignal.DefaultApi(configuration);



export async function sendPush(title:string, message:string){
  
  const notification = new OneSignal.Notification();
  notification.app_id = ONESIGNAL_APP_ID;
  notification.included_segments = ['Subscribed Users'];
  notification.contents = {
    en: "Hello OneSignal!"
  };
  console.log(client)
  console.log('nice')
  const {id} = await client.createNotification(notification);
  console.log("Id:", id)
}