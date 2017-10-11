var nodemailer = require('nodemailer');

function libCreator (execlib){

	var lib = execlib.lib,
		q = lib.q,
		qlib = lib.qlib,
		JobBase = qlib.JobBase;

	function MailSendingJobBase(transporter,data){
		JobBase.call(this);
		this.transporter = transporter;
		this.data = data;
	}

	lib.inherit(MailSendingJobBase, JobBase);

	MailSendingJobBase.prototype.destroy = function(){
		this.data = null;
		this.transporter = null;
		JobBase.prototype.destroy.call(this);
	};

	MailSendingJobBase.prototype.go = function(){
    this.transporter.sendMail(this.data, this.onMailSent.bind(this));
	};

  MailSendingJobBase.prototype.onMailSent = function(err, info){
		//from https://nodemailer.com/usage/
		//err is the error object if message failed
		//info includes the result, the exact format depends on the transport mechanism used
		//info.messageId most transports should return the final Message-Id value used with this property
		//info.envelope includes the envelope object for the message
		//info.accepted is an array returned by SMTP transports (includes recipient addresses that were accepted by the server)
		//info.rejected is an array returned by SMTP transports (includes recipient addresses that were rejected by the server)
		//info.pending is an array returned by Direct SMTP transport. Includes recipient addresses that were temporarily rejected together with the server response
		//response is a string returned by SMTP transports and includes the last SMTP response from the server
		if (!!err){
			this.defer.reject(new lib.Error('ERR_MAIL_SEND',err));
			return;
		}
		this.defer.resolve(info);
  };

  function Mailer(transport,defaults){
    //transport object API - https://nodemailer.com/smtp/#general-options
    this.transport = transport;
    this.defaults = defaults || null;
    this.transporter = nodemailer.createTransport(this.transport, this.defaults);
		this.locks = new qlib.JobCollection();
  }

  Mailer.prototype.destroy = function(){
		if (!!this.locks){
			this.locks.destroy();
		}
		this.locks = null;
    this.transporter = null;
    this.defaults = null;
    this.transport = null;
  };

  Mailer.prototype.sendMail = function(data){
    //data object API - https://nodemailer.com/message/
		return this.locks.run('send', new MailSendingJobBase(this.transporter, data));
  };

  Mailer.createTestAccount = function(cb){
    return nodemailer.createTestAccount(cb);
  };

  return Mailer;

}

module.exports = libCreator;
