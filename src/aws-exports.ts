const awsmobile = {
    aws_project_region: "ap-southeast-2",
    aws_cognito_region: "ap-southeast-2",
    aws_user_pools_id: "ap-southeast-2_cshWglA3V",
    aws_user_pools_web_client_id: "2tps1ds70055mtvlqev1a01bdo",
    oauth: {
        domain: "ap-southeast-2cshwgla3v.auth.ap-southeast-2.amazoncognito.com",
        scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: "http://localhost:3000",
        redirectSignOut: "http://localhost:3000",
        responseType: 'code'
    }
};

export default awsmobile;