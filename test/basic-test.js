var credentials = require('./credentials.json');

function createTransportObject(isSecure){
  var secure = !!isSecure;
  var port = (secure ? 465 : 587);
	return {
    host: 'smtp.gmail.com',
    port: port,
    secure: secure,
    auth: credentials
  };
}

var mailDataSingleRecipient = {
  from: credentials.user,
  to: 'lukapetrovicsi@gmail.com',
  subject: 'Employer of the month!',
  text: 'Congratulations, you are officialy employer of the month in HERS!',
  html: 'Congratulations, you are officialy employer of the month in <b>HERS</b>!'
};

var mailDataMultipleRecipient = {
  from: credentials.user,
  to: 'lukapetrovicsi@gmail.com, lukapetrovicsipp@gmail.com',
  subject: 'Best apartment in Belgrade',
  text: 'We are informed that best apartment in Belgrade is currently in development in Brace Miladinov 8. Congratulations! Sincerely, HERS Belgrade. P.S. JOS MALO PA GOTOVO!!!',
  html: 'We are informed that best apartment in Belgrade is currently in development in <i>Brace Miladinov 8</i>.<br/>Congratulations!<br/>Sincerely, <b>HERS Belgrade</b>.<br/><br/> P.S. JOS MALO PA GOTOVO!!!',
};

function sendMail(done, secure, singleRecipient){
  var transport = createTransportObject(!!secure);
  var mailData = (!!singleRecipient ? mailDataSingleRecipient : mailDataMultipleRecipient);
  var Mailer = new Lib(transport);
  Mailer.sendMail(mailData).then(
    done.bind(null,null),
    done.bind(null,new Error('Email sending failed!'))
  );
}

function onTestAccountCreated(done, secure, singleRecipient, err, account){
  console.log('DAJ ARGUMENTS ----',arguments);
  if (!!err){
    done(new Error('Test Account cannot be created!'));
    return;
  }
  if (!account){
    done(new Error('Test Account cannot be created!'));
    return;
  }
  sendMail(done,secure,singleRecipient);
}

describe('MailerLib creation', function(){
  it('Load library', function(done){
    this.timeout = 0;
    setGlobal('Lib', require('..')(execlib));
    done();
    return;
  });

  it('Simple SendMail feature - single recipient, unsecure', function(done){
    this.timeout = 0;
    sendMail(done,false,true);
  });

  /*
  it('Simple SendMail feature - multiple recipients, unsecure', function(done){
    sendMail(done,false,false);
  });
  */
});

