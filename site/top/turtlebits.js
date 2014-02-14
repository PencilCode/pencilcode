/**
 * Pencil Code IcedCoffeeScript Compiler v1.6.3-j
 * https://github.com/PencilCode/pencil-coffee-script
 *
 * Copyright 2011, Jeremy Ashkenas, Maxwell Krohn
 * Released under the MIT License
 */
(function(root){var CoffeeScript=function(){function require(e){return require[e]}return require["./helpers"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a;e.starts=function(e,t,n){return t===e.substr(n,t.length)},e.ends=function(e,t,n){var i;return i=t.length,t===e.substr(e.length-i-(n||0),i)},e.repeat=s=function(e,t){var n;for(n="";t>0;)1&t&&(n+=e),t>>>=1,e+=e;return n},e.compact=function(e){var t,n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],t&&r.push(t);return r},e.count=function(e,t){var n,i;if(n=i=0,!t.length)return 1/0;for(;i=1+e.indexOf(t,i);)n++;return n},e.merge=function(e,t){return n(n({},e),t)},n=e.extend=function(e,t){var n,i;for(n in t)i=t[n],e[n]=i;return e},e.flatten=i=function(e){var t,n,r,s;for(n=[],r=0,s=e.length;s>r;r++)t=e[r],t instanceof Array?n=n.concat(i(t)):n.push(t);return n},e.del=function(e,t){var n;return n=e[t],delete e[t],n},e.last=r=function(e,t){return e[e.length-(t||0)-1]},e.some=null!=(a=Array.prototype.some)?a:function(e){var t,n,i;for(n=0,i=this.length;i>n;n++)if(t=this[n],e(t))return!0;return!1},e.invertLiterate=function(e){var t,n,i;return i=!0,n=function(){var n,r,s,o;for(s=e.split("\n"),o=[],n=0,r=s.length;r>n;n++)t=s[n],i&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?o.push(t):(i=/^\s*$/.test(t))?o.push(t):o.push("# "+t);return o}(),n.join("\n")},t=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},e.addLocationDataFn=function(e,n){return function(i){return"object"==typeof i&&i.updateLocationDataIfMissing&&i.updateLocationDataIfMissing(t(e,n)),i}},e.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?""+(t.first_line+1)+":"+(t.first_column+1)+"-"+(""+(t.last_line+1)+":"+(t.last_column+1)):"No location data"},e.baseFileName=function(e,t,n){var i,r;return null==t&&(t=!1),null==n&&(n=!1),r=n?/\\|\//:/\//,i=e.split(r),e=i[i.length-1],t&&e.indexOf(".")>=0?(i=e.split("."),i.pop(),"coffee"===i[i.length-1]&&i.length>1&&i.pop(),i.join(".")):e},e.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md|iced)$/.test(e)},e.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},e.throwSyntaxError=function(e,t){var n;throw n=new SyntaxError(e),n.location=t,n.toString=o,n.stack=""+n,n},e.updateSyntaxError=function(e,t,n){return e.toString===o&&(e.code||(e.code=t),e.filename||(e.filename=n),e.stack=""+e),e},o=function(){var e,t,n,i,r,o,a,c,u,h,l,p,d;return this.code&&this.location?(p=this.location,a=p.first_line,o=p.first_column,u=p.last_line,c=p.last_column,null==u&&(u=a),null==c&&(c=o),r=this.filename||"[stdin]",e=this.code.split("\n")[a],l=o,i=a===u?c+1:e.length,h=s(" ",l)+s("^",i-l),"undefined"!=typeof process&&null!==process&&(n=process.stdout.isTTY&&!process.env.NODE_DISABLE_COLORS),(null!=(d=this.colorful)?d:n)&&(t=function(e){return"[1;31m"+e+"[0m"},e=e.slice(0,l)+t(e.slice(l,i))+e.slice(i),h=t(h)),""+r+":"+(a+1)+":"+(o+1)+": error: "+this.message+"\n"+e+"\n"+h):Error.prototype.toString.call(this)}}.call(this),t.exports}(),require["./rewriter"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,u,h,l,p,d,f,m,w,g,b,v,y=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},k=[].slice;for(f=function(e,t){var n;return n=[e,t],n.generated=!0,n},e.Rewriter=function(){function e(){}return e.prototype.rewrite=function(e){return this.tokens=e,this.removeLeadingNewlines(),this.closeOpenCalls(),this.closeOpenIndexes(),this.normalizeLines(),this.tagPostfixConditionals(),this.addImplicitBracesAndParens(),this.addLocationDataToGeneratedTokens(),this.tokens},e.prototype.scanTokens=function(e){var t,n,i;for(i=this.tokens,t=0;n=i[t];)t+=e.call(this,n,t,i);return!0},e.prototype.detectEnd=function(e,t,n){var i,o,a,c,u;for(a=this.tokens,i=0;o=a[e];){if(0===i&&t.call(this,o,e))return n.call(this,o,e);if(!o||0>i)return n.call(this,o,e-1);c=o[0],y.call(s,c)>=0?i+=1:(u=o[0],y.call(r,u)>=0&&(i-=1)),e+=1}return e-1},e.prototype.removeLeadingNewlines=function(){var e,t,n,i,r;for(r=this.tokens,e=n=0,i=r.length;i>n&&(t=r[e][0],"TERMINATOR"===t);e=++n);return e?this.tokens.splice(0,e):void 0},e.prototype.closeOpenCalls=function(){var e,t;return t=function(e,t){var n;return")"===(n=e[0])||"CALL_END"===n||"OUTDENT"===e[0]&&")"===this.tag(t-1)},e=function(e,t){return this.tokens["OUTDENT"===e[0]?t-1:t][0]="CALL_END"},this.scanTokens(function(n,i){return"CALL_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.closeOpenIndexes=function(){var e,t;return t=function(e){var t;return"]"===(t=e[0])||"INDEX_END"===t},e=function(e){return e[0]="INDEX_END"},this.scanTokens(function(n,i){return"INDEX_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.matchTags=function(){var e,t,n,i,r,s,o;for(t=arguments[0],i=arguments.length>=2?k.call(arguments,1):[],e=0,n=r=0,s=i.length;s>=0?s>r:r>s;n=s>=0?++r:--r){for(;"HERECOMMENT"===this.tag(t+n+e);)e+=2;if(null!=i[n]&&("string"==typeof i[n]&&(i[n]=[i[n]]),o=this.tag(t+n+e),0>y.call(i[n],o)))return!1}return!0},e.prototype.looksObjectish=function(e){return this.matchTags(e,"@",null,":")||this.matchTags(e,null,":")},e.prototype.findTagsBackwards=function(e,t){var n,i,o,a,c,u,h;for(n=[];e>=0&&(n.length||(a=this.tag(e),0>y.call(t,a)&&(c=this.tag(e),0>y.call(s,c)||this.tokens[e].generated)&&(u=this.tag(e),0>y.call(l,u))));)i=this.tag(e),y.call(r,i)>=0&&n.push(this.tag(e)),o=this.tag(e),y.call(s,o)>=0&&n.length&&n.pop(),e-=1;return h=this.tag(e),y.call(t,h)>=0},e.prototype.addImplicitBracesAndParens=function(){var e;return e=[],this.scanTokens(function(t,i,h){var p,d,m,w,g,b,v,k,_,C,F,T,L,N,x,D,E,S,A,R,I,$,O,j,P,B,V,M,H;if(O=t[0],F=(T=i>0?h[i-1]:[])[0],_=(h.length-1>i?h[i+1]:[])[0],S=function(){return e[e.length-1]},A=i,w=function(e){return i-A+e},g=function(){var e,t;return null!=(e=S())?null!=(t=e[2])?t.ours:void 0:void 0},b=function(){var e;return g()&&"("===(null!=(e=S())?e[0]:void 0)},k=function(){var e;return g()&&"{"===(null!=(e=S())?e[0]:void 0)},v=function(){var e;return g&&"CONTROL"===(null!=(e=S())?e[0]:void 0)},R=function(t){var n;return n=null!=t?t:i,e.push(["(",n,{ours:!0}]),h.splice(n,0,f("CALL_START","(")),null==t?i+=1:void 0},d=function(){return e.pop(),h.splice(i,0,f("CALL_END",")")),i+=1},p=function(){for(;b();)d()},I=function(t,n){var r;return null==n&&(n=!0),r=null!=t?t:i,e.push(["{",r,{sameLine:!0,startsLine:n,ours:!0}]),h.splice(r,0,f("{",f(new String("{")))),null==t?i+=1:void 0},m=function(t){return t=null!=t?t:i,e.pop(),h.splice(t,0,f("}","}")),i+=1},b()&&("IF"===O||"TRY"===O||"FINALLY"===O||"CATCH"===O||"CLASS"===O||"SWITCH"===O))return e.push(["CONTROL",i,{ours:!0}]),w(1);if("INDENT"===O&&g()){if("=>"!==F&&"->"!==F&&"["!==F&&"("!==F&&","!==F&&"{"!==F&&"TRY"!==F&&"ELSE"!==F&&"="!==F)for(;b();)d();return v()&&e.pop(),e.push([O,i]),w(1)}if(y.call(s,O)>=0)return e.push([O,i]),w(1);if(y.call(r,O)>=0){for(;g();)b()?d():k()?m():e.pop();e.pop()}if((y.call(c,O)>=0&&t.spaced&&!t.stringEnd||"?"===O&&i>0&&!h[i-1].spaced)&&(y.call(o,_)>=0||y.call(u,_)>=0&&!(null!=(j=h[i+1])?j.spaced:void 0)&&!(null!=(P=h[i+1])?P.newLine:void 0)))return"?"===O&&(O=t[0]="FUNC_EXIST"),R(i+1),L=w(2);if(y.call(c,O)>=0&&this.matchTags(i+1,"INDENT",null,":")&&!this.findTagsBackwards(i,["CLASS","EXTENDS","IF","CATCH","SWITCH","LEADING_WHEN","FOR","WHILE","UNTIL"]))return R(i+1),e.push(["INDENT",i+2]),w(3);if(":"===O){for(N="@"===this.tag(i-2)?i-2:i-1;"HERECOMMENT"===this.tag(N-2);)N-=2;return $=0===N||(B=this.tag(N-1),y.call(l,B)>=0)||h[N-1].newLine,S()&&(V=S(),E=V[0],D=V[1],("{"===E||"INDENT"===E&&"{"===this.tag(D-1))&&($||","===this.tag(N-1)||"{"===this.tag(N-1)))?w(1):(I(N,!!$),w(2))}if(b()&&y.call(n,O)>=0){if("OUTDENT"===F)return d(),w(1);if(T.newLine)return p(),w(1)}if(k()&&y.call(l,O)>=0&&(S()[2].sameLine=!1),y.call(a,O)>=0)for(;g();)if(M=S(),E=M[0],D=M[1],H=M[2],x=H.sameLine,$=H.startsLine,b()&&","!==F)d();else if(k()&&x&&!$)m();else{if(!k()||"TERMINATOR"!==O||","===F||$&&this.looksObjectish(i+1))break;m()}if(","===O&&!this.looksObjectish(i+1)&&k()&&("TERMINATOR"!==_||!this.looksObjectish(i+2)))for(C="OUTDENT"===_?1:0;k();)m(i+C);return w(1)})},e.prototype.addLocationDataToGeneratedTokens=function(){return this.scanTokens(function(e,t,n){var i,r,s,o,a,c;return e[2]?1:e.generated||e.explicit?("{"===e[0]&&(s=null!=(a=n[t+1])?a[2]:void 0)?(r=s.first_line,i=s.first_column):(o=null!=(c=n[t-1])?c[2]:void 0)?(r=o.last_line,i=o.last_column):r=i=0,e[2]={first_line:r,first_column:i,last_line:r,last_column:i},1):1})},e.prototype.normalizeLines=function(){var e,t,r,s,o;return o=r=s=null,t=function(e,t){var r,s,a,c;return";"!==e[1]&&(r=e[0],y.call(p,r)>=0)&&!("TERMINATOR"===e[0]&&(s=this.tag(t+1),y.call(i,s)>=0))&&!("ELSE"===e[0]&&"THEN"!==o)&&!!("CATCH"!==(a=e[0])&&"FINALLY"!==a||"->"!==o&&"=>"!==o)||(c=e[0],y.call(n,c)>=0&&this.tokens[t-1].newLine)},e=function(e,t){return this.tokens.splice(","===this.tag(t-1)?t-1:t,0,s)},this.scanTokens(function(n,a,c){var u,h,l,p,f,m;if(h=n[0],"TERMINATOR"===h){if("ELSE"===this.tag(a+1)&&"OUTDENT"!==this.tag(a-1))return c.splice.apply(c,[a,1].concat(k.call(this.indentation()))),1;if(p=this.tag(a+1),y.call(i,p)>=0)return c.splice(a,1),0}if("CATCH"===h)for(u=l=1;2>=l;u=++l)if("OUTDENT"===(f=this.tag(a+u))||"TERMINATOR"===f||"FINALLY"===f)return c.splice.apply(c,[a+u,0].concat(k.call(this.indentation()))),2+u;return y.call(d,h)>=0&&"INDENT"!==this.tag(a+1)&&("ELSE"!==h||"IF"!==this.tag(a+1))?(o=h,m=this.indentation(!0),r=m[0],s=m[1],"THEN"===o&&(r.fromThen=!0),c.splice(a+1,0,r),this.detectEnd(a+2,t,e),"THEN"===h&&c.splice(a,1),1):1})},e.prototype.tagPostfixConditionals=function(){var e,t,n;return n=null,t=function(e,t){var n,i;return i=e[0],n=this.tokens[t-1][0],"TERMINATOR"===i||"INDENT"===i&&0>y.call(d,n)},e=function(e){return"INDENT"!==e[0]||e.generated&&!e.fromThen?n[0]="POST_"+n[0]:void 0},this.scanTokens(function(i,r){return"IF"!==i[0]?1:(n=i,this.detectEnd(r+1,t,e),1)})},e.prototype.indentation=function(e){var t,n;return null==e&&(e=!1),t=["INDENT",2],n=["OUTDENT",2],e&&(t.generated=n.generated=!0),e||(t.explicit=n.explicit=!0),[t,n]},e.prototype.generate=f,e.prototype.tag=function(e){var t;return null!=(t=this.tokens[e])?t[0]:void 0},e}(),t=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["CALL_START","CALL_END"],["PARAM_START","PARAM_END"],["INDEX_START","INDEX_END"]],e.INVERSES=h={},s=[],r=[],g=0,b=t.length;b>g;g++)v=t[g],m=v[0],w=v[1],s.push(h[w]=m),r.push(h[m]=w);i=["CATCH","THEN","ELSE","FINALLY"].concat(r),c=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@","THIS"],o=["IDENTIFIER","NUMBER","STRING","JS","REGEX","NEW","PARAM_START","CLASS","IF","TRY","SWITCH","THIS","BOOL","NULL","UNDEFINED","UNARY","SUPER","THROW","@","->","=>","[","(","{","--","++"],u=["+","-"],a=["POST_IF","FOR","WHILE","UNTIL","WHEN","BY","LOOP","TERMINATOR"],d=["ELSE","->","=>","TRY","FINALLY","THEN"],p=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"],l=["TERMINATOR","INDENT","OUTDENT"],n=[".","?.","::","?::"],c.push("DEFER"),o.push("DEFER"),a.push("AWAIT")}.call(this),t.exports}(),require["./lexer"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,u,h,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,L,N,x,D,E,S,A,R,I,$,O,j,P,B,V,M,H,U,W,q,G,X,Y,z,K,J,Q,Z,et=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};Q=require("./rewriter"),O=Q.Rewriter,b=Q.INVERSES,Z=require("./helpers"),W=Z.count,K=Z.starts,U=Z.compact,X=Z.last,z=Z.repeat,q=Z.invertLiterate,Y=Z.locationDataToString,J=Z.throwSyntaxError,e.Lexer=T=function(){function e(){}return e.prototype.tokenize=function(e,t){var n,i,r,s;for(null==t&&(t={}),this.literate=t.literate,this.indent=0,this.baseIndent=0,this.indebt=0,this.outdebt=0,this.indents=[],this.ends=[],this.tokens=[],this.chunkLine=t.line||0,this.chunkColumn=t.column||0,e=this.clean(e),i=0;this.chunk=e.slice(i);)n=this.identifierToken()||this.commentToken()||this.whitespaceToken()||this.lineToken()||this.heredocToken()||this.stringToken()||this.numberToken()||this.regexToken()||this.jsToken()||this.literalToken(),s=this.getLineAndColumnFromChunk(n),this.chunkLine=s[0],this.chunkColumn=s[1],i+=n;return this.closeIndentation(),(r=this.ends.pop())&&this.error("missing "+r),t.rewrite===!1?this.tokens:(new O).rewrite(this.tokens)},e.prototype.clean=function(e){return e.charCodeAt(0)===t&&(e=e.slice(1)),e=e.replace(/\r/g,"").replace(V,""),H.test(e)&&(e="\n"+e,this.chunkLine--),this.literate&&(e=q(e)),e},e.prototype.identifierToken=function(){var e,t,n,i,r,c,u,h,l,p,d,f,m,g;return(u=w.exec(this.chunk))?(c=u[0],i=u[1],e=u[2],r=i.length,h=void 0,"own"===i&&"FOR"===this.tag()?(this.token("OWN",i),i.length):(n=e||(l=X(this.tokens))&&("."===(f=l[0])||"?."===f||"::"===f||"?::"===f||!l.spaced&&"@"===l[0])&&"defer"!==i,p="IDENTIFIER",!n&&(et.call(k,i)>=0||et.call(a,i)>=0)&&(p=i.toUpperCase(),"WHEN"===p&&(m=this.tag(),et.call(_,m)>=0)?p="LEADING_WHEN":"FOR"===p?this.seenFor=!0:"UNLESS"===p?p="IF":et.call(M,p)>=0?p="UNARY":et.call(I,p)>=0&&("INSTANCEOF"!==p&&this.seenFor?(p="FOR"+p,this.seenFor=!1):(p="RELATION","!"===this.value()&&(h=this.tokens.pop(),i="!"+i)))),et.call(y,i)>=0&&(n?(p="IDENTIFIER",i=new String(i),i.reserved=!0):et.call($,i)>=0&&this.error('reserved word "'+i+'"')),n||(et.call(s,i)>=0&&(i=o[i]),p=function(){switch(i){case"!":return"UNARY";case"==":case"!=":return"COMPARE";case"&&":case"||":return"LOGIC";case"true":case"false":return"BOOL";case"break":case"continue":return"STATEMENT";default:return p}}()),d=this.token(p,i,0,r),h&&(g=[h[2].first_line,h[2].first_column],d[2].first_line=g[0],d[2].first_column=g[1]),e&&(t=c.lastIndexOf(":"),this.token(":",":",t,e.length)),c.length)):0},e.prototype.numberToken=function(){var e,t,n,i,r;return(n=S.exec(this.chunk))?(i=n[0],/^0[BOX]/.test(i)?this.error("radix prefix '"+i+"' must be lowercase"):/E/.test(i)&&!/^0x/.test(i)?this.error("exponential notation '"+i+"' must be indicated with a lowercase 'e'"):/^0\d*[89]/.test(i)?this.error("decimal literal '"+i+"' must not be prefixed with '0'"):/^0\d+/.test(i)&&this.error("octal literal '"+i+"' must be prefixed with '0o'"),t=i.length,(r=/^0o([0-7]+)/.exec(i))&&(i="0x"+parseInt(r[1],8).toString(16)),(e=/^0b([01]+)/.exec(i))&&(i="0x"+parseInt(e[1],2).toString(16)),this.token("NUMBER",i,0,t),t):0},e.prototype.stringToken=function(){var e,t,n,i;switch(t=this.chunk.charAt(0)){case"'":n=P.exec(this.chunk)[0];break;case'"':n=this.balancedString(this.chunk,'"')}return n?(i=this.removeNewlines(n.slice(1,-1)),'"'===t&&n.indexOf("#{",1)>0?this.interpolateString(i,{strOffset:1,lexedLength:n.length}):this.token("STRING",t+this.escapeLines(i)+t,0,n.length),(e=/^(?:\\.|[^\\])*\\(?:0[0-7]|[1-7])/.test(n))&&this.error("octal escape sequences "+n+" are not allowed"),n.length):0},e.prototype.heredocToken=function(){var e,t,n,i;return(n=l.exec(this.chunk))?(t=n[0],i=t.charAt(0),e=this.sanitizeHeredoc(n[2],{quote:i,indent:null}),'"'===i&&e.indexOf("#{")>=0?this.interpolateString(e,{heredoc:!0,strOffset:3,lexedLength:t.length}):this.token("STRING",this.makeString(e,i,!0),0,t.length),t.length):0},e.prototype.commentToken=function(){var e,t,n;return(n=this.chunk.match(c))?(e=n[0],t=n[1],t&&this.token("HERECOMMENT",this.sanitizeHeredoc(t,{herecomment:!0,indent:z(" ",this.indent)}),0,e.length),e.length):0},e.prototype.jsToken=function(){var e,t;return"`"===this.chunk.charAt(0)&&(e=v.exec(this.chunk))?(this.token("JS",(t=e[0]).slice(1,-1),0,t.length),t.length):0},e.prototype.regexToken=function(){var e,t,n,i,r,s,o;return"/"!==this.chunk.charAt(0)?0:(n=f.exec(this.chunk))?t=this.heregexToken(n):(i=X(this.tokens),i&&(s=i[0],et.call(i.spaced?D:E,s)>=0)?0:(n=R.exec(this.chunk))?(o=n,n=o[0],r=o[1],e=o[2],"/*"===r.slice(0,2)&&this.error("regular expressions cannot begin with `*`"),"//"===r&&(r="/(?:)/"),this.token("REGEX",""+r+e,0,n.length),n.length):0)},e.prototype.heregexToken=function(e){var t,n,i,r,s,o,a,c,u,h,l,p,d,f,w,g;if(r=e[0],t=e[1],n=e[2],0>t.indexOf("#{"))return a=this.escapeLines(t.replace(m,"$1$2").replace(/\//g,"\\/"),!0),a.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(a||"(?:)")+"/"+n,0,r.length),r.length;for(this.token("IDENTIFIER","RegExp",0,0),this.token("CALL_START","(",0,0),h=[],f=this.interpolateString(t,{regex:!0}),p=0,d=f.length;d>p;p++){if(u=f[p],c=u[0],l=u[1],"TOKENS"===c)h.push.apply(h,l);else if("NEOSTRING"===c){if(!(l=l.replace(m,"$1$2")))continue;l=l.replace(/\\/g,"\\\\"),u[0]="STRING",u[1]=this.makeString(l,'"',!0),h.push(u)}else this.error("Unexpected "+c);o=X(this.tokens),s=["+","+"],s[2]=o[2],h.push(s)}return h.pop(),"STRING"!==(null!=(w=h[0])?w[0]:void 0)&&(this.token("STRING",'""',0,0),this.token("+","+",0,0)),(g=this.tokens).push.apply(g,h),n&&(i=r.lastIndexOf(n),this.token(",",",",i,0),this.token("STRING",'"'+n+'"',i,n.length)),this.token(")",")",r.length-1,0),r.length},e.prototype.lineToken=function(){var e,t,n,i,r;if(!(n=x.exec(this.chunk)))return 0;if(t=n[0],this.seenFor=!1,r=t.length-1-t.lastIndexOf("\n"),i=this.unfinished(),r-this.indebt===this.indent)return i?this.suppressNewlines():this.newlineToken(0),t.length;if(r>this.indent){if(i)return this.indebt=r-this.indent,this.suppressNewlines(),t.length;if(!this.tokens.length)return this.baseIndent=this.indent=r,t.length;e=r-this.indent+this.outdebt,this.token("INDENT",e,t.length-r,r),this.indents.push(e),this.ends.push("OUTDENT"),this.outdebt=this.indebt=0}else this.baseIndent>r?this.error("missing indentation",t.length):(this.indebt=0,this.outdentToken(this.indent-r,i,t.length));return this.indent=r,t.length},e.prototype.outdentToken=function(e,t,n){for(var i,r;e>0;)r=this.indents.length-1,void 0===this.indents[r]?e=0:this.indents[r]===this.outdebt?(e-=this.outdebt,this.outdebt=0):this.indents[r]<this.outdebt?(this.outdebt-=this.indents[r],e-=this.indents[r]):(i=this.indents.pop()+this.outdebt,e-=i,this.outdebt=0,this.pair("OUTDENT"),this.token("OUTDENT",i,0,n));for(i&&(this.outdebt-=e);";"===this.value();)this.tokens.pop();return"TERMINATOR"===this.tag()||t||this.token("TERMINATOR","\n",n,0),this},e.prototype.whitespaceToken=function(){var e,t,n;return(e=H.exec(this.chunk))||(t="\n"===this.chunk.charAt(0))?(n=X(this.tokens),n&&(n[e?"spaced":"newLine"]=!0),e?e[0].length:0):0},e.prototype.newlineToken=function(e){for(;";"===this.value();)this.tokens.pop();return"TERMINATOR"!==this.tag()&&this.token("TERMINATOR","\n",e,0),this},e.prototype.suppressNewlines=function(){return"\\"===this.value()&&this.tokens.pop(),this},e.prototype.literalToken=function(){var e,t,n,s,o,a,c,l;if((e=A.exec(this.chunk))?(s=e[0],r.test(s)&&this.tagParameters()):s=this.chunk.charAt(0),n=s,t=X(this.tokens),"="===s&&t&&(!t[1].reserved&&(o=t[1],et.call(y,o)>=0)&&this.error('reserved word "'+this.value()+"\" can't be assigned"),"||"===(a=t[1])||"&&"===a))return t[0]="COMPOUND_ASSIGN",t[1]+="=",s.length;if(";"===s)this.seenFor=!1,n="TERMINATOR";else if(et.call(L,s)>=0)n="MATH";else if(et.call(u,s)>=0)n="COMPARE";else if(et.call(h,s)>=0)n="COMPOUND_ASSIGN";else if(et.call(M,s)>=0)n="UNARY";else if(et.call(j,s)>=0)n="SHIFT";else if(et.call(F,s)>=0||"?"===s&&(null!=t?t.spaced:void 0))n="LOGIC";else if(t&&!t.spaced)if("("===s&&(c=t[0],et.call(i,c)>=0))"?"===t[0]&&(t[0]="FUNC_EXIST"),n="CALL_START";else if("["===s&&(l=t[0],et.call(g,l)>=0))switch(n="INDEX_START",t[0]){case"?":t[0]="INDEX_SOAK"}switch(s){case"(":case"{":case"[":this.ends.push(b[s]);break;case")":case"}":case"]":this.pair(s)}return this.token(n,s),s.length},e.prototype.sanitizeHeredoc=function(e,t){var n,i,r,s,o;if(r=t.indent,i=t.herecomment){if(p.test(e)&&this.error('block comment cannot contain "*/", starting'),0>e.indexOf("\n"))return e}else for(;s=d.exec(e);)n=s[1],(null===r||(o=n.length)>0&&r.length>o)&&(r=n);return r&&(e=e.replace(RegExp("\\n"+r,"g"),"\n")),i||(e=e.replace(/^\n/,"")),e},e.prototype.tagParameters=function(){var e,t,n,i;if(")"!==this.tag())return this;for(t=[],i=this.tokens,e=i.length,i[--e][0]="PARAM_END";n=i[--e];)switch(n[0]){case")":t.push(n);break;case"(":case"CALL_START":if(!t.length)return"("===n[0]?(n[0]="PARAM_START",this):this;t.pop()}return this},e.prototype.closeIndentation=function(){return this.outdentToken(this.indent)},e.prototype.balancedString=function(e,t){var n,i,r,s,o,a,c,u;for(n=0,a=[t],i=c=1,u=e.length;u>=1?u>c:c>u;i=u>=1?++c:--c)if(n)--n;else{switch(r=e.charAt(i)){case"\\":++n;continue;case t:if(a.pop(),!a.length)return e.slice(0,+i+1||9e9);t=a[a.length-1];continue}"}"!==t||'"'!==r&&"'"!==r?"}"===t&&"/"===r&&(s=f.exec(e.slice(i))||R.exec(e.slice(i)))?n+=s[0].length-1:"}"===t&&"{"===r?a.push(t="}"):'"'===t&&"#"===o&&"{"===r&&a.push(t="}"):a.push(t=r),o=r}return this.error("missing "+a.pop()+", starting")},e.prototype.interpolateString=function(t,n){var i,r,s,o,a,c,u,h,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,L,N,x,D,E;for(null==n&&(n={}),s=n.heredoc,v=n.regex,m=n.offsetInChunk,k=n.strOffset,l=n.lexedLength,m=m||0,k=k||0,l=l||t.length,F=[],w=0,o=-1;h=t.charAt(o+=1);)"\\"!==h?"#"===h&&"{"===t.charAt(o+1)&&(r=this.balancedString(t.slice(o+1),"}"))&&(o>w&&F.push(this.makeToken("NEOSTRING",t.slice(w,o),k+w)),a=r.slice(1,-1),a.length&&(x=this.getLineAndColumnFromChunk(k+o+1),p=x[0],i=x[1],f=(new e).tokenize(a,{line:p,column:i,rewrite:!1}),b=f.pop(),"TERMINATOR"===(null!=(D=f[0])?D[0]:void 0)&&(b=f.shift()),(u=f.length)&&(u>1&&(f.unshift(this.makeToken("(","(",k+o+1,0)),f.push(this.makeToken(")",")",k+o+1+a.length,0))),F.push(["TOKENS",f]))),o+=r.length,w=o+1):o+=1;if(o>w&&t.length>w&&F.push(this.makeToken("NEOSTRING",t.slice(w),k+w)),v)return F;if(!F.length)return this.token("STRING",'""',m,l);for("NEOSTRING"!==F[0][0]&&F.unshift(this.makeToken("NEOSTRING","",m)),(c=F.length>1)&&this.token("(","(",m,0),o=L=0,N=F.length;N>L;o=++L)C=F[o],_=C[0],T=C[1],o&&(o&&(g=this.token("+","+")),d="TOKENS"===_?T[0]:C,g[2]={first_line:d[2].first_line,first_column:d[2].first_column,last_line:d[2].first_line,last_column:d[2].first_column}),"TOKENS"===_?(E=this.tokens).push.apply(E,T):"NEOSTRING"===_?(C[0]="STRING",C[1]=this.makeString(T,'"',s),this.tokens.push(C)):this.error("Unexpected "+_);return c&&(y=this.makeToken(")",")",m+l,0),y.stringEnd=!0,this.tokens.push(y)),F},e.prototype.pair=function(e){var t,n;return e!==(n=X(this.ends))?("OUTDENT"!==n&&this.error("unmatched "+e),this.indent-=t=X(this.indents),this.outdentToken(t,!0),this.pair(e)):this.ends.pop()},e.prototype.getLineAndColumnFromChunk=function(e){var t,n,i,r;return 0===e?[this.chunkLine,this.chunkColumn]:(r=e>=this.chunk.length?this.chunk:this.chunk.slice(0,+(e-1)+1||9e9),n=W(r,"\n"),t=this.chunkColumn,n>0?(i=r.split("\n"),t=X(i).length):t+=r.length,[this.chunkLine+n,t])},e.prototype.makeToken=function(e,t,n,i){var r,s,o,a,c;return null==n&&(n=0),null==i&&(i=t.length),s={},a=this.getLineAndColumnFromChunk(n),s.first_line=a[0],s.first_column=a[1],r=Math.max(0,i-1),c=this.getLineAndColumnFromChunk(n+r),s.last_line=c[0],s.last_column=c[1],o=[e,t,s]},e.prototype.token=function(e,t,n,i){var r;return r=this.makeToken(e,t,n,i),this.tokens.push(r),r},e.prototype.tag=function(e,t){var n;return(n=X(this.tokens,e))&&(t?n[0]=t:n[0])},e.prototype.value=function(e,t){var n;return(n=X(this.tokens,e))&&(t?n[1]=t:n[1])},e.prototype.unfinished=function(){var e;return C.test(this.chunk)||"\\"===(e=this.tag())||"."===e||"?."===e||"?::"===e||"UNARY"===e||"MATH"===e||"+"===e||"-"===e||"SHIFT"===e||"RELATION"===e||"COMPARE"===e||"LOGIC"===e||"THROW"===e||"EXTENDS"===e},e.prototype.removeNewlines=function(e){return e.replace(/^\s*\n\s*/,"").replace(/([^\\]|\\\\)\s*\n\s*$/,"$1")},e.prototype.escapeLines=function(e,t){return e=e.replace(/\\[^\S\n]*(\n|\\)\s*/g,function(e,t){return"\n"===t?"":e}),t?e.replace(N,"\\n"):e.replace(/\s*\n\s*/g," ")},e.prototype.makeString=function(e,t,n){return e?(e=e.replace(RegExp("\\\\("+t+"|\\\\)","g"),function(e,n){return n===t?n:e}),e=e.replace(RegExp(""+t,"g"),"\\$&"),t+this.escapeLines(e,n)+t):t+t},e.prototype.error=function(e,t){var n,i,r;return null==t&&(t=0),r=this.getLineAndColumnFromChunk(t),i=r[0],n=r[1],J(e,{first_line:i,first_column:n})},e}(),k=["true","false","null","this","new","delete","typeof","in","instanceof","return","throw","break","continue","debugger","if","else","switch","for","while","do","try","catch","finally","class","extends","super"],a=["undefined","then","unless","until","loop","of","by","when"],a=a.concat(["await","defer"]),o={and:"&&",or:"||",is:"==",isnt:"!=",not:"!",yes:"true",no:"false",on:"true",off:"false"},s=function(){var e;e=[];for(G in o)e.push(G);return e}(),a=a.concat(s),$=["case","default","function","var","void","with","const","let","enum","export","import","native","__hasProp","__extends","__slice","__bind","__indexOf","implements","interface","package","private","protected","public","static","yield"],B=["arguments","eval"],y=k.concat($).concat(B),e.RESERVED=$.concat(k).concat(a).concat(B),e.STRICT_PROSCRIBED=B,t=65279,w=/^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/,S=/^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i,l=/^("""|''')((?:\\[\s\S]|[^\\])*?)(?:\n[^\n\S]*)?\1/,A=/^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?(\.|::)|\.{2,3})/,H=/^[^\n\S]+/,c=/^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/,r=/^[-=]>/,x=/^(?:\n[^\n\S]*)+/,P=/^'[^\\']*(?:\\[\s\S][^\\']*)*'/,v=/^`[^\\`]*(?:\\.[^\\`]*)*`/,R=/^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/,f=/^\/{3}((?:\\?[\s\S])+?)\/{3}([imgy]{0,4})(?!\w)/,m=/((?:\\\\)+)|\\(\s|\/)|\s+(?:#.*)?/g,N=/\n/g,d=/\n+([^\n\S]*)/g,p=/\*\//,C=/^\s*(?:,|\??\.(?![.\d])|::)/,V=/\s+$/,h=["-=","+=","/=","*=","%=","||=","&&=","?=","<<=",">>=",">>>=","&=","^=","|="],M=["!","~","NEW","TYPEOF","DELETE","DO"],F=["&&","||","&","|","^"],j=["<<",">>",">>>"],u=["==","!=","<",">","<=",">="],L=["*","/","%"],I=["IN","OF","INSTANCEOF"],n=["TRUE","FALSE"],D=["NUMBER","REGEX","BOOL","NULL","UNDEFINED","++","--"],E=D.concat(")","}","THIS","IDENTIFIER","STRING","]"),i=["IDENTIFIER","STRING","REGEX",")","]","}","?","::","@","THIS","SUPER"],g=i.concat("NUMBER","BOOL","NULL","UNDEFINED"),_=["INDENT","OUTDENT","TERMINATOR"],i.push("DEFER")}.call(this),t.exports}(),require["./parser"]=function(){var e={},t={exports:e},n=function(){function e(){this.yy={}}var t={trace:function(){},yy:{},symbols_:{error:2,Root:3,Body:4,Line:5,TERMINATOR:6,Expression:7,Statement:8,Return:9,Comment:10,STATEMENT:11,Await:12,AWAIT:13,Block:14,Value:15,Invocation:16,Code:17,Operation:18,Assign:19,If:20,Try:21,While:22,For:23,Switch:24,Class:25,Throw:26,Defer:27,INDENT:28,OUTDENT:29,Identifier:30,IDENTIFIER:31,AlphaNumeric:32,NUMBER:33,STRING:34,Literal:35,JS:36,REGEX:37,DEBUGGER:38,UNDEFINED:39,NULL:40,BOOL:41,Assignable:42,"=":43,AssignObj:44,ObjAssignable:45,":":46,ThisProperty:47,RETURN:48,HERECOMMENT:49,PARAM_START:50,ParamList:51,PARAM_END:52,FuncGlyph:53,"->":54,"=>":55,OptComma:56,",":57,Param:58,ParamVar:59,"...":60,Array:61,Object:62,Splat:63,SimpleAssignable:64,Accessor:65,Parenthetical:66,Range:67,This:68,".":69,"?.":70,"::":71,"?::":72,Index:73,INDEX_START:74,IndexValue:75,INDEX_END:76,INDEX_SOAK:77,Slice:78,"{":79,AssignList:80,"}":81,CLASS:82,EXTENDS:83,OptFuncExist:84,Arguments:85,SUPER:86,DEFER:87,FUNC_EXIST:88,CALL_START:89,CALL_END:90,ArgList:91,THIS:92,"@":93,"[":94,"]":95,RangeDots:96,"..":97,Arg:98,SimpleArgs:99,TRY:100,Catch:101,FINALLY:102,CATCH:103,THROW:104,"(":105,")":106,WhileSource:107,WHILE:108,WHEN:109,UNTIL:110,Loop:111,LOOP:112,ForBody:113,FOR:114,ForStart:115,ForSource:116,ForVariables:117,OWN:118,ForValue:119,FORIN:120,FOROF:121,BY:122,SWITCH:123,Whens:124,ELSE:125,When:126,LEADING_WHEN:127,IfBlock:128,IF:129,POST_IF:130,UNARY:131,"-":132,"+":133,"--":134,"++":135,"?":136,MATH:137,SHIFT:138,COMPARE:139,LOGIC:140,RELATION:141,COMPOUND_ASSIGN:142,$accept:0,$end:1},terminals_:{2:"error",6:"TERMINATOR",11:"STATEMENT",13:"AWAIT",28:"INDENT",29:"OUTDENT",31:"IDENTIFIER",33:"NUMBER",34:"STRING",36:"JS",37:"REGEX",38:"DEBUGGER",39:"UNDEFINED",40:"NULL",41:"BOOL",43:"=",46:":",48:"RETURN",49:"HERECOMMENT",50:"PARAM_START",52:"PARAM_END",54:"->",55:"=>",57:",",60:"...",69:".",70:"?.",71:"::",72:"?::",74:"INDEX_START",76:"INDEX_END",77:"INDEX_SOAK",79:"{",81:"}",82:"CLASS",83:"EXTENDS",86:"SUPER",87:"DEFER",88:"FUNC_EXIST",89:"CALL_START",90:"CALL_END",92:"THIS",93:"@",94:"[",95:"]",97:"..",100:"TRY",102:"FINALLY",103:"CATCH",104:"THROW",105:"(",106:")",108:"WHILE",109:"WHEN",110:"UNTIL",112:"LOOP",114:"FOR",118:"OWN",120:"FORIN",121:"FOROF",122:"BY",123:"SWITCH",125:"ELSE",127:"LEADING_WHEN",129:"IF",130:"POST_IF",131:"UNARY",132:"-",133:"+",134:"--",135:"++",136:"?",137:"MATH",138:"SHIFT",139:"COMPARE",140:"LOGIC",141:"RELATION",142:"COMPOUND_ASSIGN"},productions_:[0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[8,1],[12,2],[12,2],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[14,2],[14,3],[30,1],[32,1],[32,1],[35,1],[35,1],[35,1],[35,1],[35,1],[35,1],[35,1],[19,3],[19,4],[19,5],[44,1],[44,3],[44,5],[44,1],[45,1],[45,1],[45,1],[9,2],[9,1],[10,1],[17,5],[17,2],[53,1],[53,1],[56,0],[56,1],[51,0],[51,1],[51,3],[51,4],[51,6],[58,1],[58,2],[58,3],[59,1],[59,1],[59,1],[59,1],[63,2],[64,1],[64,2],[64,2],[64,1],[42,1],[42,1],[42,1],[15,1],[15,1],[15,1],[15,1],[15,1],[65,2],[65,2],[65,2],[65,2],[65,2],[65,1],[65,1],[73,3],[73,2],[75,1],[75,1],[62,4],[80,0],[80,1],[80,3],[80,4],[80,6],[25,1],[25,2],[25,3],[25,4],[25,2],[25,3],[25,4],[25,5],[16,3],[16,3],[16,1],[16,2],[27,2],[84,0],[84,1],[85,2],[85,4],[68,1],[68,1],[47,2],[61,2],[61,4],[96,1],[96,1],[67,5],[78,3],[78,2],[78,2],[78,1],[91,1],[91,3],[91,4],[91,4],[91,6],[98,1],[98,1],[99,1],[99,3],[21,2],[21,3],[21,4],[21,5],[101,3],[101,3],[101,2],[26,2],[66,3],[66,5],[107,2],[107,4],[107,2],[107,4],[22,2],[22,2],[22,2],[22,1],[111,2],[111,2],[23,2],[23,2],[23,2],[113,2],[113,2],[115,2],[115,3],[119,1],[119,1],[119,1],[119,1],[117,1],[117,3],[116,2],[116,2],[116,4],[116,4],[116,4],[116,6],[116,6],[24,5],[24,7],[24,4],[24,6],[124,1],[124,2],[126,3],[126,4],[128,3],[128,5],[20,1],[20,3],[20,3],[20,3],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,5],[18,4],[18,3]],performAction:function(e,t,n,i,r,s,o){var a=s.length-1;switch(r){case 1:return this.$=i.addLocationDataFn(o[a],o[a])(new i.Block);case 2:return this.$=s[a];case 3:this.$=i.addLocationDataFn(o[a],o[a])(i.Block.wrap([s[a]]));break;case 4:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].push(s[a]));break;case 5:this.$=s[a-1];break;case 6:this.$=s[a];break;case 7:this.$=s[a];break;case 8:this.$=s[a];break;case 9:this.$=s[a];break;case 10:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 11:this.$=s[a];break;case 12:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Await(s[a]));break;case 13:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Await(i.Block.wrap([s[a]])));break;case 14:this.$=s[a];break;case 15:this.$=s[a];break;case 16:this.$=s[a];break;case 17:this.$=s[a];break;case 18:this.$=s[a];break;case 19:this.$=s[a];break;case 20:this.$=s[a];break;case 21:this.$=s[a];break;case 22:this.$=s[a];break;case 23:this.$=s[a];break;case 24:this.$=s[a];break;case 25:this.$=s[a];break;case 26:this.$=s[a];break;case 27:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Block);break;case 28:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-1]);break;case 29:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 30:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 31:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 32:this.$=s[a];break;case 33:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 34:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 35:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 36:this.$=i.addLocationDataFn(o[a],o[a])(new i.Undefined);break;case 37:this.$=i.addLocationDataFn(o[a],o[a])(new i.Null);break;case 38:this.$=i.addLocationDataFn(o[a],o[a])(new i.Bool(s[a]));
break;case 39:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(s[a-2],s[a]));break;case 40:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(s[a-3],s[a]));break;case 41:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(s[a-4],s[a-1]));break;case 42:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 43:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(i.addLocationDataFn(o[a-2])(new i.Value(s[a-2])),s[a],"object"));break;case 44:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(i.addLocationDataFn(o[a-4])(new i.Value(s[a-4])),s[a-1],"object"));break;case 45:this.$=s[a];break;case 46:this.$=s[a];break;case 47:this.$=s[a];break;case 48:this.$=s[a];break;case 49:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Return(s[a]));break;case 50:this.$=i.addLocationDataFn(o[a],o[a])(new i.Return);break;case 51:this.$=i.addLocationDataFn(o[a],o[a])(new i.Comment(s[a]));break;case 52:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Code(s[a-3],s[a],s[a-1]));break;case 53:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Code([],s[a],s[a-1]));break;case 54:this.$=i.addLocationDataFn(o[a],o[a])("func");break;case 55:this.$=i.addLocationDataFn(o[a],o[a])("boundfunc");break;case 56:this.$=s[a];break;case 57:this.$=s[a];break;case 58:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 59:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 60:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 61:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 62:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 63:this.$=i.addLocationDataFn(o[a],o[a])(new i.Param(s[a]));break;case 64:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Param(s[a-1],null,!0));break;case 65:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Param(s[a-2],s[a]));break;case 66:this.$=s[a];break;case 67:this.$=s[a];break;case 68:this.$=s[a];break;case 69:this.$=s[a];break;case 70:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Splat(s[a-1]));break;case 71:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 72:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].add(s[a]));break;case 73:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(s[a-1],[].concat(s[a])));break;case 74:this.$=s[a];break;case 75:this.$=s[a];break;case 76:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 77:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 78:this.$=s[a];break;case 79:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 80:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 81:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 82:this.$=s[a];break;case 83:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a]));break;case 84:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a].setCustom()));break;case 85:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a],"soak"));break;case 86:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"))),i.addLocationDataFn(o[a])(new i.Access(s[a]))]);break;case 87:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"),"soak")),i.addLocationDataFn(o[a])(new i.Access(s[a]))]);break;case 88:this.$=i.addLocationDataFn(o[a],o[a])(new i.Access(new i.Literal("prototype")));break;case 89:this.$=s[a];break;case 90:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-1]);break;case 91:this.$=i.addLocationDataFn(o[a-1],o[a])(i.extend(s[a],{soak:!0}));break;case 92:this.$=i.addLocationDataFn(o[a],o[a])(new i.Index(s[a]));break;case 93:this.$=i.addLocationDataFn(o[a],o[a])(new i.Slice(s[a]));break;case 94:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Obj(s[a-2],s[a-3].generated));break;case 95:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 96:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 97:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 98:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 99:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 100:this.$=i.addLocationDataFn(o[a],o[a])(new i.Class);break;case 101:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(null,null,s[a]));break;case 102:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(null,s[a]));break;case 103:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(null,s[a-1],s[a]));break;case 104:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(s[a]));break;case 105:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(s[a-1],null,s[a]));break;case 106:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(s[a-2],s[a]));break;case 107:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Class(s[a-3],s[a-1],s[a]));break;case 108:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(s[a-2],s[a],s[a-1]));break;case 109:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(s[a-2],s[a],s[a-1]));break;case 110:this.$=i.addLocationDataFn(o[a],o[a])(new i.Call("super",[new i.Splat(new i.Literal("arguments"))]));break;case 111:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Call("super",s[a]));break;case 112:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Defer(s[a],n));break;case 113:this.$=i.addLocationDataFn(o[a],o[a])(!1);break;case 114:this.$=i.addLocationDataFn(o[a],o[a])(!0);break;case 115:this.$=i.addLocationDataFn(o[a-1],o[a])([]);break;case 116:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-2]);break;case 117:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 118:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 119:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(i.addLocationDataFn(o[a-1])(new i.Literal("this")),[i.addLocationDataFn(o[a])(new i.Access(s[a]))],"this"));break;case 120:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Arr([]));break;case 121:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Arr(s[a-2]));break;case 122:this.$=i.addLocationDataFn(o[a],o[a])("inclusive");break;case 123:this.$=i.addLocationDataFn(o[a],o[a])("exclusive");break;case 124:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Range(s[a-3],s[a-1],s[a-2]));break;case 125:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Range(s[a-2],s[a],s[a-1]));break;case 126:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(s[a-1],null,s[a]));break;case 127:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(null,s[a],s[a-1]));break;case 128:this.$=i.addLocationDataFn(o[a],o[a])(new i.Range(null,null,s[a]));break;case 129:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 130:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 131:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 132:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-2]);break;case 133:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 134:this.$=s[a];break;case 135:this.$=s[a];break;case 136:this.$=s[a];break;case 137:this.$=i.addLocationDataFn(o[a-2],o[a])([].concat(s[a-2],s[a]));break;case 138:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Try(s[a]));break;case 139:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Try(s[a-1],s[a][0],s[a][1]));break;case 140:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Try(s[a-2],null,null,s[a]));break;case 141:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Try(s[a-3],s[a-2][0],s[a-2][1],s[a]));break;case 142:this.$=i.addLocationDataFn(o[a-2],o[a])([s[a-1],s[a]]);break;case 143:this.$=i.addLocationDataFn(o[a-2],o[a])([i.addLocationDataFn(o[a-1])(new i.Value(s[a-1])),s[a]]);break;case 144:this.$=i.addLocationDataFn(o[a-1],o[a])([null,s[a]]);break;case 145:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Throw(s[a]));break;case 146:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Parens(s[a-1]));break;case 147:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Parens(s[a-2]));break;case 148:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(s[a]));break;case 149:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(s[a-2],{guard:s[a]}));break;case 150:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(s[a],{invert:!0}));break;case 151:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(s[a-2],{invert:!0,guard:s[a]}));break;case 152:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].addBody(s[a]));break;case 153:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([s[a-1]]))));break;case 154:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([s[a-1]]))));break;case 155:this.$=i.addLocationDataFn(o[a],o[a])(s[a]);break;case 156:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(s[a]));break;case 157:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(i.addLocationDataFn(o[a])(i.Block.wrap([s[a]]))));break;case 158:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a-1],s[a]));break;case 159:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a-1],s[a]));break;case 160:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a],s[a-1]));break;case 161:this.$=i.addLocationDataFn(o[a-1],o[a])({source:i.addLocationDataFn(o[a])(new i.Value(s[a]))});break;case 162:this.$=i.addLocationDataFn(o[a-1],o[a])(function(){return s[a].own=s[a-1].own,s[a].name=s[a-1][0],s[a].index=s[a-1][1],s[a]}());break;case 163:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a]);break;case 164:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return s[a].own=!0,s[a]}());break;case 165:this.$=s[a];break;case 166:this.$=s[a];break;case 167:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 168:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 169:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 170:this.$=i.addLocationDataFn(o[a-2],o[a])([s[a-2],s[a]]);break;case 171:this.$=i.addLocationDataFn(o[a-1],o[a])({source:s[a]});break;case 172:this.$=i.addLocationDataFn(o[a-1],o[a])({source:s[a],object:!0});break;case 173:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],guard:s[a]});break;case 174:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],guard:s[a],object:!0});break;case 175:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],step:s[a]});break;case 176:this.$=i.addLocationDataFn(o[a-5],o[a])({source:s[a-4],guard:s[a-2],step:s[a]});break;case 177:this.$=i.addLocationDataFn(o[a-5],o[a])({source:s[a-4],step:s[a-2],guard:s[a]});break;case 178:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Switch(s[a-3],s[a-1]));break;case 179:this.$=i.addLocationDataFn(o[a-6],o[a])(new i.Switch(s[a-5],s[a-3],s[a-1]));break;case 180:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Switch(null,s[a-1]));break;case 181:this.$=i.addLocationDataFn(o[a-5],o[a])(new i.Switch(null,s[a-3],s[a-1]));break;case 182:this.$=s[a];break;case 183:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].concat(s[a]));break;case 184:this.$=i.addLocationDataFn(o[a-2],o[a])([[s[a-1],s[a]]]);break;case 185:this.$=i.addLocationDataFn(o[a-3],o[a])([[s[a-2],s[a-1]]]);break;case 186:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a-1],s[a],{type:s[a-2]}));break;case 187:this.$=i.addLocationDataFn(o[a-4],o[a])(s[a-4].addElse(i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a-1],s[a],{type:s[a-2]}))));break;case 188:this.$=s[a];break;case 189:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].addElse(s[a]));break;case 190:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([s[a-2]])),{type:s[a-1],statement:!0}));break;case 191:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([s[a-2]])),{type:s[a-1],statement:!0}));break;case 192:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op(s[a-1],s[a]));break;case 193:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("-",s[a]));break;case 194:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("+",s[a]));break;case 195:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",s[a]));break;case 196:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",s[a]));break;case 197:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",s[a-1],null,!0));break;case 198:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",s[a-1],null,!0));break;case 199:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Existence(s[a-1]));break;case 200:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("+",s[a-2],s[a]));break;case 201:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("-",s[a-2],s[a]));break;case 202:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 203:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 204:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 205:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 206:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return"!"===s[a-1].charAt(0)?new i.Op(s[a-1].slice(1),s[a-2],s[a]).invert():new i.Op(s[a-1],s[a-2],s[a])}());break;case 207:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(s[a-2],s[a],s[a-1]));break;case 208:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(s[a-4],s[a-1],s[a-3]));break;case 209:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(s[a-3],s[a],s[a-2]));break;case 210:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Extends(s[a-2],s[a]))}},table:[{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[3]},{1:[2,2],6:[1,76]},{1:[2,3],6:[2,3],29:[2,3],106:[2,3]},{1:[2,6],6:[2,6],29:[2,6],106:[2,6],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,7],6:[2,7],29:[2,7],106:[2,7],107:89,108:[1,67],110:[1,68],113:90,114:[1,70],115:71,130:[1,88]},{1:[2,14],6:[2,14],28:[2,14],29:[2,14],52:[2,14],57:[2,14],60:[2,14],65:92,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],76:[2,14],77:[1,100],81:[2,14],84:91,88:[1,93],89:[2,113],90:[2,14],95:[2,14],97:[2,14],106:[2,14],108:[2,14],109:[2,14],110:[2,14],114:[2,14],122:[2,14],130:[2,14],132:[2,14],133:[2,14],136:[2,14],137:[2,14],138:[2,14],139:[2,14],140:[2,14],141:[2,14]},{1:[2,15],6:[2,15],28:[2,15],29:[2,15],52:[2,15],57:[2,15],60:[2,15],65:102,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],76:[2,15],77:[1,100],81:[2,15],84:101,88:[1,93],89:[2,113],90:[2,15],95:[2,15],97:[2,15],106:[2,15],108:[2,15],109:[2,15],110:[2,15],114:[2,15],122:[2,15],130:[2,15],132:[2,15],133:[2,15],136:[2,15],137:[2,15],138:[2,15],139:[2,15],140:[2,15],141:[2,15]},{1:[2,16],6:[2,16],28:[2,16],29:[2,16],52:[2,16],57:[2,16],60:[2,16],76:[2,16],81:[2,16],90:[2,16],95:[2,16],97:[2,16],106:[2,16],108:[2,16],109:[2,16],110:[2,16],114:[2,16],122:[2,16],130:[2,16],132:[2,16],133:[2,16],136:[2,16],137:[2,16],138:[2,16],139:[2,16],140:[2,16],141:[2,16]},{1:[2,17],6:[2,17],28:[2,17],29:[2,17],52:[2,17],57:[2,17],60:[2,17],76:[2,17],81:[2,17],90:[2,17],95:[2,17],97:[2,17],106:[2,17],108:[2,17],109:[2,17],110:[2,17],114:[2,17],122:[2,17],130:[2,17],132:[2,17],133:[2,17],136:[2,17],137:[2,17],138:[2,17],139:[2,17],140:[2,17],141:[2,17]},{1:[2,18],6:[2,18],28:[2,18],29:[2,18],52:[2,18],57:[2,18],60:[2,18],76:[2,18],81:[2,18],90:[2,18],95:[2,18],97:[2,18],106:[2,18],108:[2,18],109:[2,18],110:[2,18],114:[2,18],122:[2,18],130:[2,18],132:[2,18],133:[2,18],136:[2,18],137:[2,18],138:[2,18],139:[2,18],140:[2,18],141:[2,18]},{1:[2,19],6:[2,19],28:[2,19],29:[2,19],52:[2,19],57:[2,19],60:[2,19],76:[2,19],81:[2,19],90:[2,19],95:[2,19],97:[2,19],106:[2,19],108:[2,19],109:[2,19],110:[2,19],114:[2,19],122:[2,19],130:[2,19],132:[2,19],133:[2,19],136:[2,19],137:[2,19],138:[2,19],139:[2,19],140:[2,19],141:[2,19]},{1:[2,20],6:[2,20],28:[2,20],29:[2,20],52:[2,20],57:[2,20],60:[2,20],76:[2,20],81:[2,20],90:[2,20],95:[2,20],97:[2,20],106:[2,20],108:[2,20],109:[2,20],110:[2,20],114:[2,20],122:[2,20],130:[2,20],132:[2,20],133:[2,20],136:[2,20],137:[2,20],138:[2,20],139:[2,20],140:[2,20],141:[2,20]},{1:[2,21],6:[2,21],28:[2,21],29:[2,21],52:[2,21],57:[2,21],60:[2,21],76:[2,21],81:[2,21],90:[2,21],95:[2,21],97:[2,21],106:[2,21],108:[2,21],109:[2,21],110:[2,21],114:[2,21],122:[2,21],130:[2,21],132:[2,21],133:[2,21],136:[2,21],137:[2,21],138:[2,21],139:[2,21],140:[2,21],141:[2,21]},{1:[2,22],6:[2,22],28:[2,22],29:[2,22],52:[2,22],57:[2,22],60:[2,22],76:[2,22],81:[2,22],90:[2,22],95:[2,22],97:[2,22],106:[2,22],108:[2,22],109:[2,22],110:[2,22],114:[2,22],122:[2,22],130:[2,22],132:[2,22],133:[2,22],136:[2,22],137:[2,22],138:[2,22],139:[2,22],140:[2,22],141:[2,22]},{1:[2,23],6:[2,23],28:[2,23],29:[2,23],52:[2,23],57:[2,23],60:[2,23],76:[2,23],81:[2,23],90:[2,23],95:[2,23],97:[2,23],106:[2,23],108:[2,23],109:[2,23],110:[2,23],114:[2,23],122:[2,23],130:[2,23],132:[2,23],133:[2,23],136:[2,23],137:[2,23],138:[2,23],139:[2,23],140:[2,23],141:[2,23]},{1:[2,24],6:[2,24],28:[2,24],29:[2,24],52:[2,24],57:[2,24],60:[2,24],76:[2,24],81:[2,24],90:[2,24],95:[2,24],97:[2,24],106:[2,24],108:[2,24],109:[2,24],110:[2,24],114:[2,24],122:[2,24],130:[2,24],132:[2,24],133:[2,24],136:[2,24],137:[2,24],138:[2,24],139:[2,24],140:[2,24],141:[2,24]},{1:[2,25],6:[2,25],28:[2,25],29:[2,25],52:[2,25],57:[2,25],60:[2,25],76:[2,25],81:[2,25],90:[2,25],95:[2,25],97:[2,25],106:[2,25],108:[2,25],109:[2,25],110:[2,25],114:[2,25],122:[2,25],130:[2,25],132:[2,25],133:[2,25],136:[2,25],137:[2,25],138:[2,25],139:[2,25],140:[2,25],141:[2,25]},{1:[2,26],6:[2,26],28:[2,26],29:[2,26],52:[2,26],57:[2,26],60:[2,26],76:[2,26],81:[2,26],90:[2,26],95:[2,26],97:[2,26],106:[2,26],108:[2,26],109:[2,26],110:[2,26],114:[2,26],122:[2,26],130:[2,26],132:[2,26],133:[2,26],136:[2,26],137:[2,26],138:[2,26],139:[2,26],140:[2,26],141:[2,26]},{1:[2,8],6:[2,8],29:[2,8],106:[2,8],108:[2,8],110:[2,8],114:[2,8],130:[2,8]},{1:[2,9],6:[2,9],29:[2,9],106:[2,9],108:[2,9],110:[2,9],114:[2,9],130:[2,9]},{1:[2,10],6:[2,10],29:[2,10],106:[2,10],108:[2,10],110:[2,10],114:[2,10],130:[2,10]},{1:[2,11],6:[2,11],29:[2,11],106:[2,11],108:[2,11],110:[2,11],114:[2,11],130:[2,11]},{1:[2,78],6:[2,78],28:[2,78],29:[2,78],43:[1,103],52:[2,78],57:[2,78],60:[2,78],69:[2,78],70:[2,78],71:[2,78],72:[2,78],74:[2,78],76:[2,78],77:[2,78],81:[2,78],88:[2,78],89:[2,78],90:[2,78],95:[2,78],97:[2,78],106:[2,78],108:[2,78],109:[2,78],110:[2,78],114:[2,78],122:[2,78],130:[2,78],132:[2,78],133:[2,78],136:[2,78],137:[2,78],138:[2,78],139:[2,78],140:[2,78],141:[2,78]},{1:[2,79],6:[2,79],28:[2,79],29:[2,79],52:[2,79],57:[2,79],60:[2,79],69:[2,79],70:[2,79],71:[2,79],72:[2,79],74:[2,79],76:[2,79],77:[2,79],81:[2,79],88:[2,79],89:[2,79],90:[2,79],95:[2,79],97:[2,79],106:[2,79],108:[2,79],109:[2,79],110:[2,79],114:[2,79],122:[2,79],130:[2,79],132:[2,79],133:[2,79],136:[2,79],137:[2,79],138:[2,79],139:[2,79],140:[2,79],141:[2,79]},{1:[2,80],6:[2,80],28:[2,80],29:[2,80],52:[2,80],57:[2,80],60:[2,80],69:[2,80],70:[2,80],71:[2,80],72:[2,80],74:[2,80],76:[2,80],77:[2,80],81:[2,80],88:[2,80],89:[2,80],90:[2,80],95:[2,80],97:[2,80],106:[2,80],108:[2,80],109:[2,80],110:[2,80],114:[2,80],122:[2,80],130:[2,80],132:[2,80],133:[2,80],136:[2,80],137:[2,80],138:[2,80],139:[2,80],140:[2,80],141:[2,80]},{1:[2,81],6:[2,81],28:[2,81],29:[2,81],52:[2,81],57:[2,81],60:[2,81],69:[2,81],70:[2,81],71:[2,81],72:[2,81],74:[2,81],76:[2,81],77:[2,81],81:[2,81],88:[2,81],89:[2,81],90:[2,81],95:[2,81],97:[2,81],106:[2,81],108:[2,81],109:[2,81],110:[2,81],114:[2,81],122:[2,81],130:[2,81],132:[2,81],133:[2,81],136:[2,81],137:[2,81],138:[2,81],139:[2,81],140:[2,81],141:[2,81]},{1:[2,82],6:[2,82],28:[2,82],29:[2,82],52:[2,82],57:[2,82],60:[2,82],69:[2,82],70:[2,82],71:[2,82],72:[2,82],74:[2,82],76:[2,82],77:[2,82],81:[2,82],88:[2,82],89:[2,82],90:[2,82],95:[2,82],97:[2,82],106:[2,82],108:[2,82],109:[2,82],110:[2,82],114:[2,82],122:[2,82],130:[2,82],132:[2,82],133:[2,82],136:[2,82],137:[2,82],138:[2,82],139:[2,82],140:[2,82],141:[2,82]},{1:[2,110],6:[2,110],28:[2,110],29:[2,110],52:[2,110],57:[2,110],60:[2,110],69:[2,110],70:[2,110],71:[2,110],72:[2,110],74:[2,110],76:[2,110],77:[2,110],81:[2,110],85:104,88:[2,110],89:[1,105],90:[2,110],95:[2,110],97:[2,110],106:[2,110],108:[2,110],109:[2,110],110:[2,110],114:[2,110],122:[2,110],130:[2,110],132:[2,110],133:[2,110],136:[2,110],137:[2,110],138:[2,110],139:[2,110],140:[2,110],141:[2,110]},{6:[2,58],28:[2,58],30:109,31:[1,75],47:110,51:106,52:[2,58],57:[2,58],58:107,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{14:115,28:[1,116]},{7:117,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:119,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:120,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{15:122,16:123,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:124,47:65,61:49,62:50,64:121,66:25,67:26,68:27,79:[1,72],86:[1,28],92:[1,60],93:[1,61],94:[1,59],105:[1,58]},{15:122,16:123,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:124,47:65,61:49,62:50,64:125,66:25,67:26,68:27,79:[1,72],86:[1,28],92:[1,60],93:[1,61],94:[1,59],105:[1,58]},{1:[2,75],6:[2,75],28:[2,75],29:[2,75],43:[2,75],52:[2,75],57:[2,75],60:[2,75],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,75],77:[2,75],81:[2,75],83:[1,129],88:[2,75],89:[2,75],90:[2,75],95:[2,75],97:[2,75],106:[2,75],108:[2,75],109:[2,75],110:[2,75],114:[2,75],122:[2,75],130:[2,75],132:[2,75],133:[2,75],134:[1,126],135:[1,127],136:[2,75],137:[2,75],138:[2,75],139:[2,75],140:[2,75],141:[2,75],142:[1,128]},{1:[2,188],6:[2,188],28:[2,188],29:[2,188],52:[2,188],57:[2,188],60:[2,188],76:[2,188],81:[2,188],90:[2,188],95:[2,188],97:[2,188],106:[2,188],108:[2,188],109:[2,188],110:[2,188],114:[2,188],122:[2,188],125:[1,130],130:[2,188],132:[2,188],133:[2,188],136:[2,188],137:[2,188],138:[2,188],139:[2,188],140:[2,188],141:[2,188]},{14:131,28:[1,116]},{14:132,28:[1,116]},{1:[2,155],6:[2,155],28:[2,155],29:[2,155],52:[2,155],57:[2,155],60:[2,155],76:[2,155],81:[2,155],90:[2,155],95:[2,155],97:[2,155],106:[2,155],108:[2,155],109:[2,155],110:[2,155],114:[2,155],122:[2,155],130:[2,155],132:[2,155],133:[2,155],136:[2,155],137:[2,155],138:[2,155],139:[2,155],140:[2,155],141:[2,155]},{14:133,28:[1,116]},{7:134,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,135],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,100],6:[2,100],14:136,15:122,16:123,28:[1,116],29:[2,100],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:124,47:65,52:[2,100],57:[2,100],60:[2,100],61:49,62:50,64:138,66:25,67:26,68:27,76:[2,100],79:[1,72],81:[2,100],83:[1,137],86:[1,28],90:[2,100],92:[1,60],93:[1,61],94:[1,59],95:[2,100],97:[2,100],105:[1,58],106:[2,100],108:[2,100],109:[2,100],110:[2,100],114:[2,100],122:[2,100],130:[2,100],132:[2,100],133:[2,100],136:[2,100],137:[2,100],138:[2,100],139:[2,100],140:[2,100],141:[2,100]},{7:139,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{85:140,89:[1,105]},{1:[2,50],6:[2,50],7:141,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,29:[2,50],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],106:[2,50],107:39,108:[2,50],110:[2,50],111:40,112:[1,69],113:41,114:[2,50],115:71,123:[1,42],128:37,129:[1,66],130:[2,50],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,51],6:[2,51],28:[2,51],29:[2,51],57:[2,51],81:[2,51],106:[2,51],108:[2,51],110:[2,51],114:[2,51],130:[2,51]},{7:143,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],14:142,15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,116],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,76],6:[2,76],28:[2,76],29:[2,76],43:[2,76],52:[2,76],57:[2,76],60:[2,76],69:[2,76],70:[2,76],71:[2,76],72:[2,76],74:[2,76],76:[2,76],77:[2,76],81:[2,76],88:[2,76],89:[2,76],90:[2,76],95:[2,76],97:[2,76],106:[2,76],108:[2,76],109:[2,76],110:[2,76],114:[2,76],122:[2,76],130:[2,76],132:[2,76],133:[2,76],136:[2,76],137:[2,76],138:[2,76],139:[2,76],140:[2,76],141:[2,76]},{1:[2,77],6:[2,77],28:[2,77],29:[2,77],43:[2,77],52:[2,77],57:[2,77],60:[2,77],69:[2,77],70:[2,77],71:[2,77],72:[2,77],74:[2,77],76:[2,77],77:[2,77],81:[2,77],88:[2,77],89:[2,77],90:[2,77],95:[2,77],97:[2,77],106:[2,77],108:[2,77],109:[2,77],110:[2,77],114:[2,77],122:[2,77],130:[2,77],132:[2,77],133:[2,77],136:[2,77],137:[2,77],138:[2,77],139:[2,77],140:[2,77],141:[2,77]},{1:[2,32],6:[2,32],28:[2,32],29:[2,32],52:[2,32],57:[2,32],60:[2,32],69:[2,32],70:[2,32],71:[2,32],72:[2,32],74:[2,32],76:[2,32],77:[2,32],81:[2,32],88:[2,32],89:[2,32],90:[2,32],95:[2,32],97:[2,32],106:[2,32],108:[2,32],109:[2,32],110:[2,32],114:[2,32],122:[2,32],130:[2,32],132:[2,32],133:[2,32],136:[2,32],137:[2,32],138:[2,32],139:[2,32],140:[2,32],141:[2,32]},{1:[2,33],6:[2,33],28:[2,33],29:[2,33],52:[2,33],57:[2,33],60:[2,33],69:[2,33],70:[2,33],71:[2,33],72:[2,33],74:[2,33],76:[2,33],77:[2,33],81:[2,33],88:[2,33],89:[2,33],90:[2,33],95:[2,33],97:[2,33],106:[2,33],108:[2,33],109:[2,33],110:[2,33],114:[2,33],122:[2,33],130:[2,33],132:[2,33],133:[2,33],136:[2,33],137:[2,33],138:[2,33],139:[2,33],140:[2,33],141:[2,33]},{1:[2,34],6:[2,34],28:[2,34],29:[2,34],52:[2,34],57:[2,34],60:[2,34],69:[2,34],70:[2,34],71:[2,34],72:[2,34],74:[2,34],76:[2,34],77:[2,34],81:[2,34],88:[2,34],89:[2,34],90:[2,34],95:[2,34],97:[2,34],106:[2,34],108:[2,34],109:[2,34],110:[2,34],114:[2,34],122:[2,34],130:[2,34],132:[2,34],133:[2,34],136:[2,34],137:[2,34],138:[2,34],139:[2,34],140:[2,34],141:[2,34]},{1:[2,35],6:[2,35],28:[2,35],29:[2,35],52:[2,35],57:[2,35],60:[2,35],69:[2,35],70:[2,35],71:[2,35],72:[2,35],74:[2,35],76:[2,35],77:[2,35],81:[2,35],88:[2,35],89:[2,35],90:[2,35],95:[2,35],97:[2,35],106:[2,35],108:[2,35],109:[2,35],110:[2,35],114:[2,35],122:[2,35],130:[2,35],132:[2,35],133:[2,35],136:[2,35],137:[2,35],138:[2,35],139:[2,35],140:[2,35],141:[2,35]},{1:[2,36],6:[2,36],28:[2,36],29:[2,36],52:[2,36],57:[2,36],60:[2,36],69:[2,36],70:[2,36],71:[2,36],72:[2,36],74:[2,36],76:[2,36],77:[2,36],81:[2,36],88:[2,36],89:[2,36],90:[2,36],95:[2,36],97:[2,36],106:[2,36],108:[2,36],109:[2,36],110:[2,36],114:[2,36],122:[2,36],130:[2,36],132:[2,36],133:[2,36],136:[2,36],137:[2,36],138:[2,36],139:[2,36],140:[2,36],141:[2,36]},{1:[2,37],6:[2,37],28:[2,37],29:[2,37],52:[2,37],57:[2,37],60:[2,37],69:[2,37],70:[2,37],71:[2,37],72:[2,37],74:[2,37],76:[2,37],77:[2,37],81:[2,37],88:[2,37],89:[2,37],90:[2,37],95:[2,37],97:[2,37],106:[2,37],108:[2,37],109:[2,37],110:[2,37],114:[2,37],122:[2,37],130:[2,37],132:[2,37],133:[2,37],136:[2,37],137:[2,37],138:[2,37],139:[2,37],140:[2,37],141:[2,37]},{1:[2,38],6:[2,38],28:[2,38],29:[2,38],52:[2,38],57:[2,38],60:[2,38],69:[2,38],70:[2,38],71:[2,38],72:[2,38],74:[2,38],76:[2,38],77:[2,38],81:[2,38],88:[2,38],89:[2,38],90:[2,38],95:[2,38],97:[2,38],106:[2,38],108:[2,38],109:[2,38],110:[2,38],114:[2,38],122:[2,38],130:[2,38],132:[2,38],133:[2,38],136:[2,38],137:[2,38],138:[2,38],139:[2,38],140:[2,38],141:[2,38]},{4:144,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,145],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:146,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:148,92:[1,60],93:[1,61],94:[1,59],95:[1,147],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,117],6:[2,117],28:[2,117],29:[2,117],52:[2,117],57:[2,117],60:[2,117],69:[2,117],70:[2,117],71:[2,117],72:[2,117],74:[2,117],76:[2,117],77:[2,117],81:[2,117],88:[2,117],89:[2,117],90:[2,117],95:[2,117],97:[2,117],106:[2,117],108:[2,117],109:[2,117],110:[2,117],114:[2,117],122:[2,117],130:[2,117],132:[2,117],133:[2,117],136:[2,117],137:[2,117],138:[2,117],139:[2,117],140:[2,117],141:[2,117]},{1:[2,118],6:[2,118],28:[2,118],29:[2,118],30:152,31:[1,75],52:[2,118],57:[2,118],60:[2,118],69:[2,118],70:[2,118],71:[2,118],72:[2,118],74:[2,118],76:[2,118],77:[2,118],81:[2,118],88:[2,118],89:[2,118],90:[2,118],95:[2,118],97:[2,118],106:[2,118],108:[2,118],109:[2,118],110:[2,118],114:[2,118],122:[2,118],130:[2,118],132:[2,118],133:[2,118],136:[2,118],137:[2,118],138:[2,118],139:[2,118],140:[2,118],141:[2,118]},{28:[2,54]},{28:[2,55]},{1:[2,71],6:[2,71],28:[2,71],29:[2,71],43:[2,71],52:[2,71],57:[2,71],60:[2,71],69:[2,71],70:[2,71],71:[2,71],72:[2,71],74:[2,71],76:[2,71],77:[2,71],81:[2,71],83:[2,71],88:[2,71],89:[2,71],90:[2,71],95:[2,71],97:[2,71],106:[2,71],108:[2,71],109:[2,71],110:[2,71],114:[2,71],122:[2,71],130:[2,71],132:[2,71],133:[2,71],134:[2,71],135:[2,71],136:[2,71],137:[2,71],138:[2,71],139:[2,71],140:[2,71],141:[2,71],142:[2,71]},{1:[2,74],6:[2,74],28:[2,74],29:[2,74],43:[2,74],52:[2,74],57:[2,74],60:[2,74],69:[2,74],70:[2,74],71:[2,74],72:[2,74],74:[2,74],76:[2,74],77:[2,74],81:[2,74],83:[2,74],88:[2,74],89:[2,74],90:[2,74],95:[2,74],97:[2,74],106:[2,74],108:[2,74],109:[2,74],110:[2,74],114:[2,74],122:[2,74],130:[2,74],132:[2,74],133:[2,74],134:[2,74],135:[2,74],136:[2,74],137:[2,74],138:[2,74],139:[2,74],140:[2,74],141:[2,74],142:[2,74]},{7:153,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:154,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:155,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:157,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],14:156,15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,116],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{30:162,31:[1,75],47:163,61:164,62:165,67:158,79:[1,72],93:[1,113],94:[1,59],117:159,118:[1,160],119:161},{116:166,120:[1,167],121:[1,168]},{6:[2,95],10:172,28:[2,95],30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:170,45:171,47:175,49:[1,47],57:[2,95],80:169,81:[2,95],93:[1,113]},{1:[2,30],6:[2,30],28:[2,30],29:[2,30],46:[2,30],52:[2,30],57:[2,30],60:[2,30],69:[2,30],70:[2,30],71:[2,30],72:[2,30],74:[2,30],76:[2,30],77:[2,30],81:[2,30],88:[2,30],89:[2,30],90:[2,30],95:[2,30],97:[2,30],106:[2,30],108:[2,30],109:[2,30],110:[2,30],114:[2,30],122:[2,30],130:[2,30],132:[2,30],133:[2,30],136:[2,30],137:[2,30],138:[2,30],139:[2,30],140:[2,30],141:[2,30]},{1:[2,31],6:[2,31],28:[2,31],29:[2,31],46:[2,31],52:[2,31],57:[2,31],60:[2,31],69:[2,31],70:[2,31],71:[2,31],72:[2,31],74:[2,31],76:[2,31],77:[2,31],81:[2,31],88:[2,31],89:[2,31],90:[2,31],95:[2,31],97:[2,31],106:[2,31],108:[2,31],109:[2,31],110:[2,31],114:[2,31],122:[2,31],130:[2,31],132:[2,31],133:[2,31],136:[2,31],137:[2,31],138:[2,31],139:[2,31],140:[2,31],141:[2,31]},{1:[2,29],6:[2,29],28:[2,29],29:[2,29],43:[2,29],46:[2,29],52:[2,29],57:[2,29],60:[2,29],69:[2,29],70:[2,29],71:[2,29],72:[2,29],74:[2,29],76:[2,29],77:[2,29],81:[2,29],83:[2,29],88:[2,29],89:[2,29],90:[2,29],95:[2,29],97:[2,29],106:[2,29],108:[2,29],109:[2,29],110:[2,29],114:[2,29],120:[2,29],121:[2,29],122:[2,29],130:[2,29],132:[2,29],133:[2,29],134:[2,29],135:[2,29],136:[2,29],137:[2,29],138:[2,29],139:[2,29],140:[2,29],141:[2,29],142:[2,29]},{1:[2,5],5:176,6:[2,5],7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,29:[2,5],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],106:[2,5],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,199],6:[2,199],28:[2,199],29:[2,199],52:[2,199],57:[2,199],60:[2,199],76:[2,199],81:[2,199],90:[2,199],95:[2,199],97:[2,199],106:[2,199],108:[2,199],109:[2,199],110:[2,199],114:[2,199],122:[2,199],130:[2,199],132:[2,199],133:[2,199],136:[2,199],137:[2,199],138:[2,199],139:[2,199],140:[2,199],141:[2,199]},{7:177,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:178,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:179,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:180,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:181,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:182,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:183,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:184,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,154],6:[2,154],28:[2,154],29:[2,154],52:[2,154],57:[2,154],60:[2,154],76:[2,154],81:[2,154],90:[2,154],95:[2,154],97:[2,154],106:[2,154],108:[2,154],109:[2,154],110:[2,154],114:[2,154],122:[2,154],130:[2,154],132:[2,154],133:[2,154],136:[2,154],137:[2,154],138:[2,154],139:[2,154],140:[2,154],141:[2,154]},{1:[2,159],6:[2,159],28:[2,159],29:[2,159],52:[2,159],57:[2,159],60:[2,159],76:[2,159],81:[2,159],90:[2,159],95:[2,159],97:[2,159],106:[2,159],108:[2,159],109:[2,159],110:[2,159],114:[2,159],122:[2,159],130:[2,159],132:[2,159],133:[2,159],136:[2,159],137:[2,159],138:[2,159],139:[2,159],140:[2,159],141:[2,159]},{7:185,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,153],6:[2,153],28:[2,153],29:[2,153],52:[2,153],57:[2,153],60:[2,153],76:[2,153],81:[2,153],90:[2,153],95:[2,153],97:[2,153],106:[2,153],108:[2,153],109:[2,153],110:[2,153],114:[2,153],122:[2,153],130:[2,153],132:[2,153],133:[2,153],136:[2,153],137:[2,153],138:[2,153],139:[2,153],140:[2,153],141:[2,153]},{1:[2,158],6:[2,158],28:[2,158],29:[2,158],52:[2,158],57:[2,158],60:[2,158],76:[2,158],81:[2,158],90:[2,158],95:[2,158],97:[2,158],106:[2,158],108:[2,158],109:[2,158],110:[2,158],114:[2,158],122:[2,158],130:[2,158],132:[2,158],133:[2,158],136:[2,158],137:[2,158],138:[2,158],139:[2,158],140:[2,158],141:[2,158]},{85:186,89:[1,105]},{1:[2,72],6:[2,72],28:[2,72],29:[2,72],43:[2,72],52:[2,72],57:[2,72],60:[2,72],69:[2,72],70:[2,72],71:[2,72],72:[2,72],74:[2,72],76:[2,72],77:[2,72],81:[2,72],83:[2,72],88:[2,72],89:[2,72],90:[2,72],95:[2,72],97:[2,72],106:[2,72],108:[2,72],109:[2,72],110:[2,72],114:[2,72],122:[2,72],130:[2,72],132:[2,72],133:[2,72],134:[2,72],135:[2,72],136:[2,72],137:[2,72],138:[2,72],139:[2,72],140:[2,72],141:[2,72],142:[2,72]},{89:[2,114]},{27:188,30:187,31:[1,75],87:[1,45]},{30:189,31:[1,75]},{1:[2,88],6:[2,88],28:[2,88],29:[2,88],30:190,31:[1,75],43:[2,88],52:[2,88],57:[2,88],60:[2,88],69:[2,88],70:[2,88],71:[2,88],72:[2,88],74:[2,88],76:[2,88],77:[2,88],81:[2,88],83:[2,88],88:[2,88],89:[2,88],90:[2,88],95:[2,88],97:[2,88],106:[2,88],108:[2,88],109:[2,88],110:[2,88],114:[2,88],122:[2,88],130:[2,88],132:[2,88],133:[2,88],134:[2,88],135:[2,88],136:[2,88],137:[2,88],138:[2,88],139:[2,88],140:[2,88],141:[2,88],142:[2,88]},{30:191,31:[1,75]},{1:[2,89],6:[2,89],28:[2,89],29:[2,89],43:[2,89],52:[2,89],57:[2,89],60:[2,89],69:[2,89],70:[2,89],71:[2,89],72:[2,89],74:[2,89],76:[2,89],77:[2,89],81:[2,89],83:[2,89],88:[2,89],89:[2,89],90:[2,89],95:[2,89],97:[2,89],106:[2,89],108:[2,89],109:[2,89],110:[2,89],114:[2,89],122:[2,89],130:[2,89],132:[2,89],133:[2,89],134:[2,89],135:[2,89],136:[2,89],137:[2,89],138:[2,89],139:[2,89],140:[2,89],141:[2,89],142:[2,89]},{7:193,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],60:[1,197],61:49,62:50,64:36,66:25,67:26,68:27,75:192,78:194,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],96:195,97:[1,196],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{73:198,74:[1,99],77:[1,100]},{85:199,89:[1,105]},{1:[2,73],6:[2,73],28:[2,73],29:[2,73],43:[2,73],52:[2,73],57:[2,73],60:[2,73],69:[2,73],70:[2,73],71:[2,73],72:[2,73],74:[2,73],76:[2,73],77:[2,73],81:[2,73],83:[2,73],88:[2,73],89:[2,73],90:[2,73],95:[2,73],97:[2,73],106:[2,73],108:[2,73],109:[2,73],110:[2,73],114:[2,73],122:[2,73],130:[2,73],132:[2,73],133:[2,73],134:[2,73],135:[2,73],136:[2,73],137:[2,73],138:[2,73],139:[2,73],140:[2,73],141:[2,73],142:[2,73]},{6:[1,201],7:200,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,202],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,111],6:[2,111],28:[2,111],29:[2,111],52:[2,111],57:[2,111],60:[2,111],69:[2,111],70:[2,111],71:[2,111],72:[2,111],74:[2,111],76:[2,111],77:[2,111],81:[2,111],88:[2,111],89:[2,111],90:[2,111],95:[2,111],97:[2,111],106:[2,111],108:[2,111],109:[2,111],110:[2,111],114:[2,111],122:[2,111],130:[2,111],132:[2,111],133:[2,111],136:[2,111],137:[2,111],138:[2,111],139:[2,111],140:[2,111],141:[2,111]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],90:[1,203],91:204,92:[1,60],93:[1,61],94:[1,59],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,56],28:[2,56],52:[1,206],56:208,57:[1,207]},{6:[2,59],28:[2,59],29:[2,59],52:[2,59],57:[2,59]},{6:[2,63],28:[2,63],29:[2,63],43:[1,210],52:[2,63],57:[2,63],60:[1,209]},{6:[2,66],28:[2,66],29:[2,66],43:[2,66],52:[2,66],57:[2,66],60:[2,66]},{6:[2,67],28:[2,67],29:[2,67],43:[2,67],52:[2,67],57:[2,67],60:[2,67]},{6:[2,68],28:[2,68],29:[2,68],43:[2,68],52:[2,68],57:[2,68],60:[2,68]},{6:[2,69],28:[2,69],29:[2,69],43:[2,69],52:[2,69],57:[2,69],60:[2,69]},{30:152,31:[1,75]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:148,92:[1,60],93:[1,61],94:[1,59],95:[1,147],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,53],6:[2,53],28:[2,53],29:[2,53],52:[2,53],57:[2,53],60:[2,53],76:[2,53],81:[2,53],90:[2,53],95:[2,53],97:[2,53],106:[2,53],108:[2,53],109:[2,53],110:[2,53],114:[2,53],122:[2,53],130:[2,53],132:[2,53],133:[2,53],136:[2,53],137:[2,53],138:[2,53],139:[2,53],140:[2,53],141:[2,53]},{4:212,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,29:[1,211],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,192],6:[2,192],28:[2,192],29:[2,192],52:[2,192],57:[2,192],60:[2,192],76:[2,192],81:[2,192],90:[2,192],95:[2,192],97:[2,192],106:[2,192],107:86,108:[2,192],109:[2,192],110:[2,192],113:87,114:[2,192],115:71,122:[2,192],130:[2,192],132:[2,192],133:[2,192],136:[1,77],137:[2,192],138:[2,192],139:[2,192],140:[2,192],141:[2,192]},{107:89,108:[1,67],110:[1,68],113:90,114:[1,70],115:71,130:[1,88]},{1:[2,193],6:[2,193],28:[2,193],29:[2,193],52:[2,193],57:[2,193],60:[2,193],76:[2,193],81:[2,193],90:[2,193],95:[2,193],97:[2,193],106:[2,193],107:86,108:[2,193],109:[2,193],110:[2,193],113:87,114:[2,193],115:71,122:[2,193],130:[2,193],132:[2,193],133:[2,193],136:[1,77],137:[2,193],138:[2,193],139:[2,193],140:[2,193],141:[2,193]},{1:[2,194],6:[2,194],28:[2,194],29:[2,194],52:[2,194],57:[2,194],60:[2,194],76:[2,194],81:[2,194],90:[2,194],95:[2,194],97:[2,194],106:[2,194],107:86,108:[2,194],109:[2,194],110:[2,194],113:87,114:[2,194],115:71,122:[2,194],130:[2,194],132:[2,194],133:[2,194],136:[1,77],137:[2,194],138:[2,194],139:[2,194],140:[2,194],141:[2,194]},{1:[2,195],6:[2,195],28:[2,195],29:[2,195],52:[2,195],57:[2,195],60:[2,195],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,195],77:[2,75],81:[2,195],88:[2,75],89:[2,75],90:[2,195],95:[2,195],97:[2,195],106:[2,195],108:[2,195],109:[2,195],110:[2,195],114:[2,195],122:[2,195],130:[2,195],132:[2,195],133:[2,195],136:[2,195],137:[2,195],138:[2,195],139:[2,195],140:[2,195],141:[2,195]},{65:92,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],77:[1,100],84:91,88:[1,93],89:[2,113]},{65:102,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],77:[1,100],84:101,88:[1,93],89:[2,113]},{69:[2,78],70:[2,78],71:[2,78],72:[2,78],74:[2,78],77:[2,78],88:[2,78],89:[2,78]},{1:[2,196],6:[2,196],28:[2,196],29:[2,196],52:[2,196],57:[2,196],60:[2,196],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,196],77:[2,75],81:[2,196],88:[2,75],89:[2,75],90:[2,196],95:[2,196],97:[2,196],106:[2,196],108:[2,196],109:[2,196],110:[2,196],114:[2,196],122:[2,196],130:[2,196],132:[2,196],133:[2,196],136:[2,196],137:[2,196],138:[2,196],139:[2,196],140:[2,196],141:[2,196]},{1:[2,197],6:[2,197],28:[2,197],29:[2,197],52:[2,197],57:[2,197],60:[2,197],76:[2,197],81:[2,197],90:[2,197],95:[2,197],97:[2,197],106:[2,197],108:[2,197],109:[2,197],110:[2,197],114:[2,197],122:[2,197],130:[2,197],132:[2,197],133:[2,197],136:[2,197],137:[2,197],138:[2,197],139:[2,197],140:[2,197],141:[2,197]},{1:[2,198],6:[2,198],28:[2,198],29:[2,198],52:[2,198],57:[2,198],60:[2,198],76:[2,198],81:[2,198],90:[2,198],95:[2,198],97:[2,198],106:[2,198],108:[2,198],109:[2,198],110:[2,198],114:[2,198],122:[2,198],130:[2,198],132:[2,198],133:[2,198],136:[2,198],137:[2,198],138:[2,198],139:[2,198],140:[2,198],141:[2,198]},{6:[1,215],7:213,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,214],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:216,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{14:217,28:[1,116],129:[1,218]},{1:[2,138],6:[2,138],28:[2,138],29:[2,138],52:[2,138],57:[2,138],60:[2,138],76:[2,138],81:[2,138],90:[2,138],95:[2,138],97:[2,138],101:219,102:[1,220],103:[1,221],106:[2,138],108:[2,138],109:[2,138],110:[2,138],114:[2,138],122:[2,138],130:[2,138],132:[2,138],133:[2,138],136:[2,138],137:[2,138],138:[2,138],139:[2,138],140:[2,138],141:[2,138]},{1:[2,152],6:[2,152],28:[2,152],29:[2,152],52:[2,152],57:[2,152],60:[2,152],76:[2,152],81:[2,152],90:[2,152],95:[2,152],97:[2,152],106:[2,152],108:[2,152],109:[2,152],110:[2,152],114:[2,152],122:[2,152],130:[2,152],132:[2,152],133:[2,152],136:[2,152],137:[2,152],138:[2,152],139:[2,152],140:[2,152],141:[2,152]},{1:[2,160],6:[2,160],28:[2,160],29:[2,160],52:[2,160],57:[2,160],60:[2,160],76:[2,160],81:[2,160],90:[2,160],95:[2,160],97:[2,160],106:[2,160],108:[2,160],109:[2,160],110:[2,160],114:[2,160],122:[2,160],130:[2,160],132:[2,160],133:[2,160],136:[2,160],137:[2,160],138:[2,160],139:[2,160],140:[2,160],141:[2,160]},{28:[1,222],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{124:223,126:224,127:[1,225]},{1:[2,101],6:[2,101],28:[2,101],29:[2,101],52:[2,101],57:[2,101],60:[2,101],76:[2,101],81:[2,101],90:[2,101],95:[2,101],97:[2,101],106:[2,101],108:[2,101],109:[2,101],110:[2,101],114:[2,101],122:[2,101],130:[2,101],132:[2,101],133:[2,101],136:[2,101],137:[2,101],138:[2,101],139:[2,101],140:[2,101],141:[2,101]},{7:226,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,104],6:[2,104],14:227,28:[1,116],29:[2,104],52:[2,104],57:[2,104],60:[2,104],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,104],77:[2,75],81:[2,104],83:[1,228],88:[2,75],89:[2,75],90:[2,104],95:[2,104],97:[2,104],106:[2,104],108:[2,104],109:[2,104],110:[2,104],114:[2,104],122:[2,104],130:[2,104],132:[2,104],133:[2,104],136:[2,104],137:[2,104],138:[2,104],139:[2,104],140:[2,104],141:[2,104]},{1:[2,145],6:[2,145],28:[2,145],29:[2,145],52:[2,145],57:[2,145],60:[2,145],76:[2,145],81:[2,145],90:[2,145],95:[2,145],97:[2,145],106:[2,145],107:86,108:[2,145],109:[2,145],110:[2,145],113:87,114:[2,145],115:71,122:[2,145],130:[2,145],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,112],6:[2,112],28:[2,112],29:[2,112],43:[2,112],52:[2,112],57:[2,112],60:[2,112],69:[2,112],70:[2,112],71:[2,112],72:[2,112],74:[2,112],76:[2,112],77:[2,112],81:[2,112],83:[2,112],88:[2,112],89:[2,112],90:[2,112],95:[2,112],97:[2,112],106:[2,112],108:[2,112],109:[2,112],110:[2,112],114:[2,112],122:[2,112],130:[2,112],132:[2,112],133:[2,112],134:[2,112],135:[2,112],136:[2,112],137:[2,112],138:[2,112],139:[2,112],140:[2,112],141:[2,112],142:[2,112]},{1:[2,49],6:[2,49],29:[2,49],106:[2,49],107:86,108:[2,49],110:[2,49],113:87,114:[2,49],115:71,130:[2,49],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,12],6:[2,12],29:[2,12],106:[2,12],108:[2,12],110:[2,12],114:[2,12],130:[2,12]},{1:[2,13],6:[2,13],29:[2,13],106:[2,13],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[2,13],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,76],106:[1,229]},{4:230,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,134],28:[2,134],57:[2,134],60:[1,232],95:[2,134],96:231,97:[1,196],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,120],6:[2,120],28:[2,120],29:[2,120],43:[2,120],52:[2,120],57:[2,120],60:[2,120],69:[2,120],70:[2,120],71:[2,120],72:[2,120],74:[2,120],76:[2,120],77:[2,120],81:[2,120],88:[2,120],89:[2,120],90:[2,120],95:[2,120],97:[2,120],106:[2,120],108:[2,120],109:[2,120],110:[2,120],114:[2,120],120:[2,120],121:[2,120],122:[2,120],130:[2,120],132:[2,120],133:[2,120],136:[2,120],137:[2,120],138:[2,120],139:[2,120],140:[2,120],141:[2,120]},{6:[2,56],28:[2,56],56:233,57:[1,234],95:[2,56]},{6:[2,129],28:[2,129],29:[2,129],57:[2,129],90:[2,129],95:[2,129]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:235,92:[1,60],93:[1,61],94:[1,59],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,135],28:[2,135],29:[2,135],57:[2,135],90:[2,135],95:[2,135]},{1:[2,119],6:[2,119],28:[2,119],29:[2,119],43:[2,119],46:[2,119],52:[2,119],57:[2,119],60:[2,119],69:[2,119],70:[2,119],71:[2,119],72:[2,119],74:[2,119],76:[2,119],77:[2,119],81:[2,119],83:[2,119],88:[2,119],89:[2,119],90:[2,119],95:[2,119],97:[2,119],106:[2,119],108:[2,119],109:[2,119],110:[2,119],114:[2,119],120:[2,119],121:[2,119],122:[2,119],130:[2,119],132:[2,119],133:[2,119],134:[2,119],135:[2,119],136:[2,119],137:[2,119],138:[2,119],139:[2,119],140:[2,119],141:[2,119],142:[2,119]},{14:236,28:[1,116],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,148],6:[2,148],28:[2,148],29:[2,148],52:[2,148],57:[2,148],60:[2,148],76:[2,148],81:[2,148],90:[2,148],95:[2,148],97:[2,148],106:[2,148],107:86,108:[1,67],109:[1,237],110:[1,68],113:87,114:[1,70],115:71,122:[2,148],130:[2,148],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,150],6:[2,150],28:[2,150],29:[2,150],52:[2,150],57:[2,150],60:[2,150],76:[2,150],81:[2,150],90:[2,150],95:[2,150],97:[2,150],106:[2,150],107:86,108:[1,67],109:[1,238],110:[1,68],113:87,114:[1,70],115:71,122:[2,150],130:[2,150],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,156],6:[2,156],28:[2,156],29:[2,156],52:[2,156],57:[2,156],60:[2,156],76:[2,156],81:[2,156],90:[2,156],95:[2,156],97:[2,156],106:[2,156],108:[2,156],109:[2,156],110:[2,156],114:[2,156],122:[2,156],130:[2,156],132:[2,156],133:[2,156],136:[2,156],137:[2,156],138:[2,156],139:[2,156],140:[2,156],141:[2,156]},{1:[2,157],6:[2,157],28:[2,157],29:[2,157],52:[2,157],57:[2,157],60:[2,157],76:[2,157],81:[2,157],90:[2,157],95:[2,157],97:[2,157],106:[2,157],107:86,108:[1,67],109:[2,157],110:[1,68],113:87,114:[1,70],115:71,122:[2,157],130:[2,157],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,161],6:[2,161],28:[2,161],29:[2,161],52:[2,161],57:[2,161],60:[2,161],76:[2,161],81:[2,161],90:[2,161],95:[2,161],97:[2,161],106:[2,161],108:[2,161],109:[2,161],110:[2,161],114:[2,161],122:[2,161],130:[2,161],132:[2,161],133:[2,161],136:[2,161],137:[2,161],138:[2,161],139:[2,161],140:[2,161],141:[2,161]},{120:[2,163],121:[2,163]},{30:162,31:[1,75],47:163,61:164,62:165,79:[1,72],93:[1,113],94:[1,114],117:239,119:161},{57:[1,240],120:[2,169],121:[2,169]},{57:[2,165],120:[2,165],121:[2,165]},{57:[2,166],120:[2,166],121:[2,166]},{57:[2,167],120:[2,167],121:[2,167]},{57:[2,168],120:[2,168],121:[2,168]},{1:[2,162],6:[2,162],28:[2,162],29:[2,162],52:[2,162],57:[2,162],60:[2,162],76:[2,162],81:[2,162],90:[2,162],95:[2,162],97:[2,162],106:[2,162],108:[2,162],109:[2,162],110:[2,162],114:[2,162],122:[2,162],130:[2,162],132:[2,162],133:[2,162],136:[2,162],137:[2,162],138:[2,162],139:[2,162],140:[2,162],141:[2,162]},{7:241,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:242,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,56],28:[2,56],56:243,57:[1,244],81:[2,56]},{6:[2,96],28:[2,96],29:[2,96],57:[2,96],81:[2,96]},{6:[2,42],28:[2,42],29:[2,42],46:[1,245],57:[2,42],81:[2,42]},{6:[2,45],28:[2,45],29:[2,45],57:[2,45],81:[2,45]},{6:[2,46],28:[2,46],29:[2,46],46:[2,46],57:[2,46],81:[2,46]},{6:[2,47],28:[2,47],29:[2,47],46:[2,47],57:[2,47],81:[2,47]},{6:[2,48],28:[2,48],29:[2,48],46:[2,48],57:[2,48],81:[2,48]},{1:[2,4],6:[2,4],29:[2,4],106:[2,4]},{1:[2,200],6:[2,200],28:[2,200],29:[2,200],52:[2,200],57:[2,200],60:[2,200],76:[2,200],81:[2,200],90:[2,200],95:[2,200],97:[2,200],106:[2,200],107:86,108:[2,200],109:[2,200],110:[2,200],113:87,114:[2,200],115:71,122:[2,200],130:[2,200],132:[2,200],133:[2,200],136:[1,77],137:[1,80],138:[2,200],139:[2,200],140:[2,200],141:[2,200]},{1:[2,201],6:[2,201],28:[2,201],29:[2,201],52:[2,201],57:[2,201],60:[2,201],76:[2,201],81:[2,201],90:[2,201],95:[2,201],97:[2,201],106:[2,201],107:86,108:[2,201],109:[2,201],110:[2,201],113:87,114:[2,201],115:71,122:[2,201],130:[2,201],132:[2,201],133:[2,201],136:[1,77],137:[1,80],138:[2,201],139:[2,201],140:[2,201],141:[2,201]},{1:[2,202],6:[2,202],28:[2,202],29:[2,202],52:[2,202],57:[2,202],60:[2,202],76:[2,202],81:[2,202],90:[2,202],95:[2,202],97:[2,202],106:[2,202],107:86,108:[2,202],109:[2,202],110:[2,202],113:87,114:[2,202],115:71,122:[2,202],130:[2,202],132:[2,202],133:[2,202],136:[1,77],137:[2,202],138:[2,202],139:[2,202],140:[2,202],141:[2,202]},{1:[2,203],6:[2,203],28:[2,203],29:[2,203],52:[2,203],57:[2,203],60:[2,203],76:[2,203],81:[2,203],90:[2,203],95:[2,203],97:[2,203],106:[2,203],107:86,108:[2,203],109:[2,203],110:[2,203],113:87,114:[2,203],115:71,122:[2,203],130:[2,203],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[2,203],139:[2,203],140:[2,203],141:[2,203]},{1:[2,204],6:[2,204],28:[2,204],29:[2,204],52:[2,204],57:[2,204],60:[2,204],76:[2,204],81:[2,204],90:[2,204],95:[2,204],97:[2,204],106:[2,204],107:86,108:[2,204],109:[2,204],110:[2,204],113:87,114:[2,204],115:71,122:[2,204],130:[2,204],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[2,204],140:[2,204],141:[1,84]},{1:[2,205],6:[2,205],28:[2,205],29:[2,205],52:[2,205],57:[2,205],60:[2,205],76:[2,205],81:[2,205],90:[2,205],95:[2,205],97:[2,205],106:[2,205],107:86,108:[2,205],109:[2,205],110:[2,205],113:87,114:[2,205],115:71,122:[2,205],130:[2,205],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[2,205],141:[1,84]},{1:[2,206],6:[2,206],28:[2,206],29:[2,206],52:[2,206],57:[2,206],60:[2,206],76:[2,206],81:[2,206],90:[2,206],95:[2,206],97:[2,206],106:[2,206],107:86,108:[2,206],109:[2,206],110:[2,206],113:87,114:[2,206],115:71,122:[2,206],130:[2,206],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[2,206],140:[2,206],141:[2,206]},{1:[2,191],6:[2,191],28:[2,191],29:[2,191],52:[2,191],57:[2,191],60:[2,191],76:[2,191],81:[2,191],90:[2,191],95:[2,191],97:[2,191],106:[2,191],107:86,108:[1,67],109:[2,191],110:[1,68],113:87,114:[1,70],115:71,122:[2,191],130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,190],6:[2,190],28:[2,190],29:[2,190],52:[2,190],57:[2,190],60:[2,190],76:[2,190],81:[2,190],90:[2,190],95:[2,190],97:[2,190],106:[2,190],107:86,108:[1,67],109:[2,190],110:[1,68],113:87,114:[1,70],115:71,122:[2,190],130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,108],6:[2,108],28:[2,108],29:[2,108],52:[2,108],57:[2,108],60:[2,108],69:[2,108],70:[2,108],71:[2,108],72:[2,108],74:[2,108],76:[2,108],77:[2,108],81:[2,108],88:[2,108],89:[2,108],90:[2,108],95:[2,108],97:[2,108],106:[2,108],108:[2,108],109:[2,108],110:[2,108],114:[2,108],122:[2,108],130:[2,108],132:[2,108],133:[2,108],136:[2,108],137:[2,108],138:[2,108],139:[2,108],140:[2,108],141:[2,108]},{1:[2,83],6:[2,83],28:[2,83],29:[2,83],43:[2,83],52:[2,83],57:[2,83],60:[2,83],69:[2,83],70:[2,83],71:[2,83],72:[2,83],74:[2,83],76:[2,83],77:[2,83],81:[2,83],83:[2,83],88:[2,83],89:[2,83],90:[2,83],95:[2,83],97:[2,83],106:[2,83],108:[2,83],109:[2,83],110:[2,83],114:[2,83],122:[2,83],130:[2,83],132:[2,83],133:[2,83],134:[2,83],135:[2,83],136:[2,83],137:[2,83],138:[2,83],139:[2,83],140:[2,83],141:[2,83],142:[2,83]},{1:[2,84],6:[2,84],28:[2,84],29:[2,84],43:[2,84],52:[2,84],57:[2,84],60:[2,84],69:[2,84],70:[2,84],71:[2,84],72:[2,84],74:[2,84],76:[2,84],77:[2,84],81:[2,84],83:[2,84],88:[2,84],89:[2,84],90:[2,84],95:[2,84],97:[2,84],106:[2,84],108:[2,84],109:[2,84],110:[2,84],114:[2,84],122:[2,84],130:[2,84],132:[2,84],133:[2,84],134:[2,84],135:[2,84],136:[2,84],137:[2,84],138:[2,84],139:[2,84],140:[2,84],141:[2,84],142:[2,84]},{1:[2,85],6:[2,85],28:[2,85],29:[2,85],43:[2,85],52:[2,85],57:[2,85],60:[2,85],69:[2,85],70:[2,85],71:[2,85],72:[2,85],74:[2,85],76:[2,85],77:[2,85],81:[2,85],83:[2,85],88:[2,85],89:[2,85],90:[2,85],95:[2,85],97:[2,85],106:[2,85],108:[2,85],109:[2,85],110:[2,85],114:[2,85],122:[2,85],130:[2,85],132:[2,85],133:[2,85],134:[2,85],135:[2,85],136:[2,85],137:[2,85],138:[2,85],139:[2,85],140:[2,85],141:[2,85],142:[2,85]},{1:[2,86],6:[2,86],28:[2,86],29:[2,86],43:[2,86],52:[2,86],57:[2,86],60:[2,86],69:[2,86],70:[2,86],71:[2,86],72:[2,86],74:[2,86],76:[2,86],77:[2,86],81:[2,86],83:[2,86],88:[2,86],89:[2,86],90:[2,86],95:[2,86],97:[2,86],106:[2,86],108:[2,86],109:[2,86],110:[2,86],114:[2,86],122:[2,86],130:[2,86],132:[2,86],133:[2,86],134:[2,86],135:[2,86],136:[2,86],137:[2,86],138:[2,86],139:[2,86],140:[2,86],141:[2,86],142:[2,86]},{1:[2,87],6:[2,87],28:[2,87],29:[2,87],43:[2,87],52:[2,87],57:[2,87],60:[2,87],69:[2,87],70:[2,87],71:[2,87],72:[2,87],74:[2,87],76:[2,87],77:[2,87],81:[2,87],83:[2,87],88:[2,87],89:[2,87],90:[2,87],95:[2,87],97:[2,87],106:[2,87],108:[2,87],109:[2,87],110:[2,87],114:[2,87],122:[2,87],130:[2,87],132:[2,87],133:[2,87],134:[2,87],135:[2,87],136:[2,87],137:[2,87],138:[2,87],139:[2,87],140:[2,87],141:[2,87],142:[2,87]},{76:[1,246]},{60:[1,197],76:[2,92],96:247,97:[1,196],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{76:[2,93]},{7:248,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,76:[2,128],79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{11:[2,122],13:[2,122],31:[2,122],33:[2,122],34:[2,122],36:[2,122],37:[2,122],38:[2,122],39:[2,122],40:[2,122],41:[2,122],48:[2,122],49:[2,122],50:[2,122],54:[2,122],55:[2,122],76:[2,122],79:[2,122],82:[2,122],86:[2,122],87:[2,122],92:[2,122],93:[2,122],94:[2,122],100:[2,122],104:[2,122],105:[2,122],108:[2,122],110:[2,122],112:[2,122],114:[2,122],123:[2,122],129:[2,122],131:[2,122],132:[2,122],133:[2,122],134:[2,122],135:[2,122]},{11:[2,123],13:[2,123],31:[2,123],33:[2,123],34:[2,123],36:[2,123],37:[2,123],38:[2,123],39:[2,123],40:[2,123],41:[2,123],48:[2,123],49:[2,123],50:[2,123],54:[2,123],55:[2,123],76:[2,123],79:[2,123],82:[2,123],86:[2,123],87:[2,123],92:[2,123],93:[2,123],94:[2,123],100:[2,123],104:[2,123],105:[2,123],108:[2,123],110:[2,123],112:[2,123],114:[2,123],123:[2,123],129:[2,123],131:[2,123],132:[2,123],133:[2,123],134:[2,123],135:[2,123]},{1:[2,91],6:[2,91],28:[2,91],29:[2,91],43:[2,91],52:[2,91],57:[2,91],60:[2,91],69:[2,91],70:[2,91],71:[2,91],72:[2,91],74:[2,91],76:[2,91],77:[2,91],81:[2,91],83:[2,91],88:[2,91],89:[2,91],90:[2,91],95:[2,91],97:[2,91],106:[2,91],108:[2,91],109:[2,91],110:[2,91],114:[2,91],122:[2,91],130:[2,91],132:[2,91],133:[2,91],134:[2,91],135:[2,91],136:[2,91],137:[2,91],138:[2,91],139:[2,91],140:[2,91],141:[2,91],142:[2,91]},{1:[2,109],6:[2,109],28:[2,109],29:[2,109],52:[2,109],57:[2,109],60:[2,109],69:[2,109],70:[2,109],71:[2,109],72:[2,109],74:[2,109],76:[2,109],77:[2,109],81:[2,109],88:[2,109],89:[2,109],90:[2,109],95:[2,109],97:[2,109],106:[2,109],108:[2,109],109:[2,109],110:[2,109],114:[2,109],122:[2,109],130:[2,109],132:[2,109],133:[2,109],136:[2,109],137:[2,109],138:[2,109],139:[2,109],140:[2,109],141:[2,109]},{1:[2,39],6:[2,39],28:[2,39],29:[2,39],52:[2,39],57:[2,39],60:[2,39],76:[2,39],81:[2,39],90:[2,39],95:[2,39],97:[2,39],106:[2,39],107:86,108:[2,39],109:[2,39],110:[2,39],113:87,114:[2,39],115:71,122:[2,39],130:[2,39],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{7:249,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:250,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,115],6:[2,115],28:[2,115],29:[2,115],43:[2,115],52:[2,115],57:[2,115],60:[2,115],69:[2,115],70:[2,115],71:[2,115],72:[2,115],74:[2,115],76:[2,115],77:[2,115],81:[2,115],83:[2,115],88:[2,115],89:[2,115],90:[2,115],95:[2,115],97:[2,115],106:[2,115],108:[2,115],109:[2,115],110:[2,115],114:[2,115],122:[2,115],130:[2,115],132:[2,115],133:[2,115],134:[2,115],135:[2,115],136:[2,115],137:[2,115],138:[2,115],139:[2,115],140:[2,115],141:[2,115],142:[2,115]},{6:[2,56],28:[2,56],56:251,57:[1,234],90:[2,56]},{6:[2,134],28:[2,134],29:[2,134],57:[2,134],60:[1,252],90:[2,134],95:[2,134],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{53:253,54:[1,62],55:[1,63]},{6:[2,57],28:[2,57],29:[2,57],30:109,31:[1,75],47:110,58:254,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{6:[1,255],28:[1,256]},{6:[2,64],28:[2,64],29:[2,64],52:[2,64],57:[2,64]},{7:257,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,27],6:[2,27],28:[2,27],29:[2,27],52:[2,27],57:[2,27],60:[2,27],76:[2,27],81:[2,27],90:[2,27],95:[2,27],97:[2,27],102:[2,27],103:[2,27],106:[2,27],108:[2,27],109:[2,27],110:[2,27],114:[2,27],122:[2,27],125:[2,27],127:[2,27],130:[2,27],132:[2,27],133:[2,27],136:[2,27],137:[2,27],138:[2,27],139:[2,27],140:[2,27],141:[2,27]},{6:[1,76],29:[1,258]},{1:[2,207],6:[2,207],28:[2,207],29:[2,207],52:[2,207],57:[2,207],60:[2,207],76:[2,207],81:[2,207],90:[2,207],95:[2,207],97:[2,207],106:[2,207],107:86,108:[2,207],109:[2,207],110:[2,207],113:87,114:[2,207],115:71,122:[2,207],130:[2,207],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{7:259,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:260,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,210],6:[2,210],28:[2,210],29:[2,210],52:[2,210],57:[2,210],60:[2,210],76:[2,210],81:[2,210],90:[2,210],95:[2,210],97:[2,210],106:[2,210],107:86,108:[2,210],109:[2,210],110:[2,210],113:87,114:[2,210],115:71,122:[2,210],130:[2,210],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,189],6:[2,189],28:[2,189],29:[2,189],52:[2,189],57:[2,189],60:[2,189],76:[2,189],81:[2,189],90:[2,189],95:[2,189],97:[2,189],106:[2,189],108:[2,189],109:[2,189],110:[2,189],114:[2,189],122:[2,189],130:[2,189],132:[2,189],133:[2,189],136:[2,189],137:[2,189],138:[2,189],139:[2,189],140:[2,189],141:[2,189]},{7:261,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,139],6:[2,139],28:[2,139],29:[2,139],52:[2,139],57:[2,139],60:[2,139],76:[2,139],81:[2,139],90:[2,139],95:[2,139],97:[2,139],102:[1,262],106:[2,139],108:[2,139],109:[2,139],110:[2,139],114:[2,139],122:[2,139],130:[2,139],132:[2,139],133:[2,139],136:[2,139],137:[2,139],138:[2,139],139:[2,139],140:[2,139],141:[2,139]},{14:263,28:[1,116]},{14:266,28:[1,116],30:264,31:[1,75],62:265,79:[1,72]},{124:267,126:224,127:[1,225]},{29:[1,268],125:[1,269],126:270,127:[1,225]},{29:[2,182],125:[2,182],127:[2,182]},{7:272,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],99:271,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,102],6:[2,102],14:273,28:[1,116],29:[2,102],52:[2,102],57:[2,102],60:[2,102],76:[2,102],81:[2,102],90:[2,102],95:[2,102],97:[2,102],106:[2,102],107:86,108:[1,67],109:[2,102],110:[1,68],113:87,114:[1,70],115:71,122:[2,102],130:[2,102],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,105],6:[2,105],28:[2,105],29:[2,105],52:[2,105],57:[2,105],60:[2,105],76:[2,105],81:[2,105],90:[2,105],95:[2,105],97:[2,105],106:[2,105],108:[2,105],109:[2,105],110:[2,105],114:[2,105],122:[2,105],130:[2,105],132:[2,105],133:[2,105],136:[2,105],137:[2,105],138:[2,105],139:[2,105],140:[2,105],141:[2,105]},{7:274,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,146],6:[2,146],28:[2,146],29:[2,146],52:[2,146],57:[2,146],60:[2,146],69:[2,146],70:[2,146],71:[2,146],72:[2,146],74:[2,146],76:[2,146],77:[2,146],81:[2,146],88:[2,146],89:[2,146],90:[2,146],95:[2,146],97:[2,146],106:[2,146],108:[2,146],109:[2,146],110:[2,146],114:[2,146],122:[2,146],130:[2,146],132:[2,146],133:[2,146],136:[2,146],137:[2,146],138:[2,146],139:[2,146],140:[2,146],141:[2,146]},{6:[1,76],29:[1,275]},{7:276,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,70],11:[2,123],13:[2,123],28:[2,70],31:[2,123],33:[2,123],34:[2,123],36:[2,123],37:[2,123],38:[2,123],39:[2,123],40:[2,123],41:[2,123],48:[2,123],49:[2,123],50:[2,123],54:[2,123],55:[2,123],57:[2,70],79:[2,123],82:[2,123],86:[2,123],87:[2,123],92:[2,123],93:[2,123],94:[2,123],95:[2,70],100:[2,123],104:[2,123],105:[2,123],108:[2,123],110:[2,123],112:[2,123],114:[2,123],123:[2,123],129:[2,123],131:[2,123],132:[2,123],133:[2,123],134:[2,123],135:[2,123]},{6:[1,278],28:[1,279],95:[1,277]},{6:[2,57],7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[2,57],29:[2,57],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],90:[2,57],92:[1,60],93:[1,61],94:[1,59],95:[2,57],98:280,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,56],28:[2,56],29:[2,56],56:281,57:[1,234]},{1:[2,186],6:[2,186],28:[2,186],29:[2,186],52:[2,186],57:[2,186],60:[2,186],76:[2,186],81:[2,186],90:[2,186],95:[2,186],97:[2,186],106:[2,186],108:[2,186],109:[2,186],110:[2,186],114:[2,186],122:[2,186],125:[2,186],130:[2,186],132:[2,186],133:[2,186],136:[2,186],137:[2,186],138:[2,186],139:[2,186],140:[2,186],141:[2,186]},{7:282,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:283,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{120:[2,164],121:[2,164]},{30:162,31:[1,75],47:163,61:164,62:165,79:[1,72],93:[1,113],94:[1,114],119:284},{1:[2,171],6:[2,171],28:[2,171],29:[2,171],52:[2,171],57:[2,171],60:[2,171],76:[2,171],81:[2,171],90:[2,171],95:[2,171],97:[2,171],106:[2,171],107:86,108:[2,171],109:[1,285],110:[2,171],113:87,114:[2,171],115:71,122:[1,286],130:[2,171],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,172],6:[2,172],28:[2,172],29:[2,172],52:[2,172],57:[2,172],60:[2,172],76:[2,172],81:[2,172],90:[2,172],95:[2,172],97:[2,172],106:[2,172],107:86,108:[2,172],109:[1,287],110:[2,172],113:87,114:[2,172],115:71,122:[2,172],130:[2,172],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,289],28:[1,290],81:[1,288]},{6:[2,57],10:172,28:[2,57],29:[2,57],30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:291,45:171,47:175,49:[1,47],81:[2,57],93:[1,113]},{7:292,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,293],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,90],6:[2,90],28:[2,90],29:[2,90],43:[2,90],52:[2,90],57:[2,90],60:[2,90],69:[2,90],70:[2,90],71:[2,90],72:[2,90],74:[2,90],76:[2,90],77:[2,90],81:[2,90],83:[2,90],88:[2,90],89:[2,90],90:[2,90],95:[2,90],97:[2,90],106:[2,90],108:[2,90],109:[2,90],110:[2,90],114:[2,90],122:[2,90],130:[2,90],132:[2,90],133:[2,90],134:[2,90],135:[2,90],136:[2,90],137:[2,90],138:[2,90],139:[2,90],140:[2,90],141:[2,90],142:[2,90]},{7:294,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,76:[2,126],79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{76:[2,127],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,40],6:[2,40],28:[2,40],29:[2,40],52:[2,40],57:[2,40],60:[2,40],76:[2,40],81:[2,40],90:[2,40],95:[2,40],97:[2,40],106:[2,40],107:86,108:[2,40],109:[2,40],110:[2,40],113:87,114:[2,40],115:71,122:[2,40],130:[2,40],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{29:[1,295],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,278],28:[1,279],90:[1,296]},{6:[2,70],28:[2,70],29:[2,70],57:[2,70],90:[2,70],95:[2,70]},{14:297,28:[1,116]},{6:[2,60],28:[2,60],29:[2,60],52:[2,60],57:[2,60]},{30:109,31:[1,75],47:110,58:298,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{6:[2,58],28:[2,58],29:[2,58],30:109,31:[1,75],47:110,51:299,57:[2,58],58:107,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{6:[2,65],28:[2,65],29:[2,65],52:[2,65],57:[2,65],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,28],6:[2,28],28:[2,28],29:[2,28],52:[2,28],57:[2,28],60:[2,28],76:[2,28],81:[2,28],90:[2,28],95:[2,28],97:[2,28],102:[2,28],103:[2,28],106:[2,28],108:[2,28],109:[2,28],110:[2,28],114:[2,28],122:[2,28],125:[2,28],127:[2,28],130:[2,28],132:[2,28],133:[2,28],136:[2,28],137:[2,28],138:[2,28],139:[2,28],140:[2,28],141:[2,28]},{29:[1,300],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,209],6:[2,209],28:[2,209],29:[2,209],52:[2,209],57:[2,209],60:[2,209],76:[2,209],81:[2,209],90:[2,209],95:[2,209],97:[2,209],106:[2,209],107:86,108:[2,209],109:[2,209],110:[2,209],113:87,114:[2,209],115:71,122:[2,209],130:[2,209],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{14:301,28:[1,116],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{14:302,28:[1,116]},{1:[2,140],6:[2,140],28:[2,140],29:[2,140],52:[2,140],57:[2,140],60:[2,140],76:[2,140],81:[2,140],90:[2,140],95:[2,140],97:[2,140],106:[2,140],108:[2,140],109:[2,140],110:[2,140],114:[2,140],122:[2,140],130:[2,140],132:[2,140],133:[2,140],136:[2,140],137:[2,140],138:[2,140],139:[2,140],140:[2,140],141:[2,140]},{14:303,28:[1,116]},{14:304,28:[1,116]},{1:[2,144],6:[2,144],28:[2,144],29:[2,144],52:[2,144],57:[2,144],60:[2,144],76:[2,144],81:[2,144],90:[2,144],95:[2,144],97:[2,144],102:[2,144],106:[2,144],108:[2,144],109:[2,144],110:[2,144],114:[2,144],122:[2,144],130:[2,144],132:[2,144],133:[2,144],136:[2,144],137:[2,144],138:[2,144],139:[2,144],140:[2,144],141:[2,144]},{29:[1,305],125:[1,306],126:270,127:[1,225]},{1:[2,180],6:[2,180],28:[2,180],29:[2,180],52:[2,180],57:[2,180],60:[2,180],76:[2,180],81:[2,180],90:[2,180],95:[2,180],97:[2,180],106:[2,180],108:[2,180],109:[2,180],110:[2,180],114:[2,180],122:[2,180],130:[2,180],132:[2,180],133:[2,180],136:[2,180],137:[2,180],138:[2,180],139:[2,180],140:[2,180],141:[2,180]},{14:307,28:[1,116]},{29:[2,183],125:[2,183],127:[2,183]},{14:308,28:[1,116],57:[1,309]},{28:[2,136],57:[2,136],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,103],6:[2,103],28:[2,103],29:[2,103],52:[2,103],57:[2,103],60:[2,103],76:[2,103],81:[2,103],90:[2,103],95:[2,103],97:[2,103],106:[2,103],108:[2,103],109:[2,103],110:[2,103],114:[2,103],122:[2,103],130:[2,103],132:[2,103],133:[2,103],136:[2,103],137:[2,103],138:[2,103],139:[2,103],140:[2,103],141:[2,103]},{1:[2,106],6:[2,106],14:310,28:[1,116],29:[2,106],52:[2,106],57:[2,106],60:[2,106],76:[2,106],81:[2,106],90:[2,106],95:[2,106],97:[2,106],106:[2,106],107:86,108:[1,67],109:[2,106],110:[1,68],113:87,114:[1,70],115:71,122:[2,106],130:[2,106],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{106:[1,311]},{95:[1,312],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,121],6:[2,121],28:[2,121],29:[2,121],43:[2,121],52:[2,121],57:[2,121],60:[2,121],69:[2,121],70:[2,121],71:[2,121],72:[2,121],74:[2,121],76:[2,121],77:[2,121],81:[2,121],88:[2,121],89:[2,121],90:[2,121],95:[2,121],97:[2,121],106:[2,121],108:[2,121],109:[2,121],110:[2,121],114:[2,121],120:[2,121],121:[2,121],122:[2,121],130:[2,121],132:[2,121],133:[2,121],136:[2,121],137:[2,121],138:[2,121],139:[2,121],140:[2,121],141:[2,121]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],98:313,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:314,92:[1,60],93:[1,61],94:[1,59],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,130],28:[2,130],29:[2,130],57:[2,130],90:[2,130],95:[2,130]},{6:[1,278],28:[1,279],29:[1,315]},{1:[2,149],6:[2,149],28:[2,149],29:[2,149],52:[2,149],57:[2,149],60:[2,149],76:[2,149],81:[2,149],90:[2,149],95:[2,149],97:[2,149],106:[2,149],107:86,108:[1,67],109:[2,149],110:[1,68],113:87,114:[1,70],115:71,122:[2,149],130:[2,149],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,151],6:[2,151],28:[2,151],29:[2,151],52:[2,151],57:[2,151],60:[2,151],76:[2,151],81:[2,151],90:[2,151],95:[2,151],97:[2,151],106:[2,151],107:86,108:[1,67],109:[2,151],110:[1,68],113:87,114:[1,70],115:71,122:[2,151],130:[2,151],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{120:[2,170],121:[2,170]},{7:316,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:317,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:318,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,94],6:[2,94],28:[2,94],29:[2,94],43:[2,94],52:[2,94],57:[2,94],60:[2,94],69:[2,94],70:[2,94],71:[2,94],72:[2,94],74:[2,94],76:[2,94],77:[2,94],81:[2,94],88:[2,94],89:[2,94],90:[2,94],95:[2,94],97:[2,94],106:[2,94],108:[2,94],109:[2,94],110:[2,94],114:[2,94],120:[2,94],121:[2,94],122:[2,94],130:[2,94],132:[2,94],133:[2,94],136:[2,94],137:[2,94],138:[2,94],139:[2,94],140:[2,94],141:[2,94]},{10:172,30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:319,45:171,47:175,49:[1,47],93:[1,113]},{6:[2,95],10:172,28:[2,95],29:[2,95],30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:170,45:171,47:175,49:[1,47],57:[2,95],80:320,93:[1,113]},{6:[2,97],28:[2,97],29:[2,97],57:[2,97],81:[2,97]},{6:[2,43],28:[2,43],29:[2,43],57:[2,43],81:[2,43],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{7:321,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{76:[2,125],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,41],6:[2,41],28:[2,41],29:[2,41],52:[2,41],57:[2,41],60:[2,41],76:[2,41],81:[2,41],90:[2,41],95:[2,41],97:[2,41],106:[2,41],108:[2,41],109:[2,41],110:[2,41],114:[2,41],122:[2,41],130:[2,41],132:[2,41],133:[2,41],136:[2,41],137:[2,41],138:[2,41],139:[2,41],140:[2,41],141:[2,41]},{1:[2,116],6:[2,116],28:[2,116],29:[2,116],43:[2,116],52:[2,116],57:[2,116],60:[2,116],69:[2,116],70:[2,116],71:[2,116],72:[2,116],74:[2,116],76:[2,116],77:[2,116],81:[2,116],83:[2,116],88:[2,116],89:[2,116],90:[2,116],95:[2,116],97:[2,116],106:[2,116],108:[2,116],109:[2,116],110:[2,116],114:[2,116],122:[2,116],130:[2,116],132:[2,116],133:[2,116],134:[2,116],135:[2,116],136:[2,116],137:[2,116],138:[2,116],139:[2,116],140:[2,116],141:[2,116],142:[2,116]},{1:[2,52],6:[2,52],28:[2,52],29:[2,52],52:[2,52],57:[2,52],60:[2,52],76:[2,52],81:[2,52],90:[2,52],95:[2,52],97:[2,52],106:[2,52],108:[2,52],109:[2,52],110:[2,52],114:[2,52],122:[2,52],130:[2,52],132:[2,52],133:[2,52],136:[2,52],137:[2,52],138:[2,52],139:[2,52],140:[2,52],141:[2,52]},{6:[2,61],28:[2,61],29:[2,61],52:[2,61],57:[2,61]},{6:[2,56],28:[2,56],29:[2,56],56:322,57:[1,207]},{1:[2,208],6:[2,208],28:[2,208],29:[2,208],52:[2,208],57:[2,208],60:[2,208],76:[2,208],81:[2,208],90:[2,208],95:[2,208],97:[2,208],106:[2,208],108:[2,208],109:[2,208],110:[2,208],114:[2,208],122:[2,208],130:[2,208],132:[2,208],133:[2,208],136:[2,208],137:[2,208],138:[2,208],139:[2,208],140:[2,208],141:[2,208]},{1:[2,187],6:[2,187],28:[2,187],29:[2,187],52:[2,187],57:[2,187],60:[2,187],76:[2,187],81:[2,187],90:[2,187],95:[2,187],97:[2,187],106:[2,187],108:[2,187],109:[2,187],110:[2,187],114:[2,187],122:[2,187],125:[2,187],130:[2,187],132:[2,187],133:[2,187],136:[2,187],137:[2,187],138:[2,187],139:[2,187],140:[2,187],141:[2,187]},{1:[2,141],6:[2,141],28:[2,141],29:[2,141],52:[2,141],57:[2,141],60:[2,141],76:[2,141],81:[2,141],90:[2,141],95:[2,141],97:[2,141],106:[2,141],108:[2,141],109:[2,141],110:[2,141],114:[2,141],122:[2,141],130:[2,141],132:[2,141],133:[2,141],136:[2,141],137:[2,141],138:[2,141],139:[2,141],140:[2,141],141:[2,141]},{1:[2,142],6:[2,142],28:[2,142],29:[2,142],52:[2,142],57:[2,142],60:[2,142],76:[2,142],81:[2,142],90:[2,142],95:[2,142],97:[2,142],102:[2,142],106:[2,142],108:[2,142],109:[2,142],110:[2,142],114:[2,142],122:[2,142],130:[2,142],132:[2,142],133:[2,142],136:[2,142],137:[2,142],138:[2,142],139:[2,142],140:[2,142],141:[2,142]},{1:[2,143],6:[2,143],28:[2,143],29:[2,143],52:[2,143],57:[2,143],60:[2,143],76:[2,143],81:[2,143],90:[2,143],95:[2,143],97:[2,143],102:[2,143],106:[2,143],108:[2,143],109:[2,143],110:[2,143],114:[2,143],122:[2,143],130:[2,143],132:[2,143],133:[2,143],136:[2,143],137:[2,143],138:[2,143],139:[2,143],140:[2,143],141:[2,143]},{1:[2,178],6:[2,178],28:[2,178],29:[2,178],52:[2,178],57:[2,178],60:[2,178],76:[2,178],81:[2,178],90:[2,178],95:[2,178],97:[2,178],106:[2,178],108:[2,178],109:[2,178],110:[2,178],114:[2,178],122:[2,178],130:[2,178],132:[2,178],133:[2,178],136:[2,178],137:[2,178],138:[2,178],139:[2,178],140:[2,178],141:[2,178]},{14:323,28:[1,116]},{29:[1,324]},{6:[1,325],29:[2,184],125:[2,184],127:[2,184]},{7:326,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,107],6:[2,107],28:[2,107],29:[2,107],52:[2,107],57:[2,107],60:[2,107],76:[2,107],81:[2,107],90:[2,107],95:[2,107],97:[2,107],106:[2,107],108:[2,107],109:[2,107],110:[2,107],114:[2,107],122:[2,107],130:[2,107],132:[2,107],133:[2,107],136:[2,107],137:[2,107],138:[2,107],139:[2,107],140:[2,107],141:[2,107]},{1:[2,147],6:[2,147],28:[2,147],29:[2,147],52:[2,147],57:[2,147],60:[2,147],69:[2,147],70:[2,147],71:[2,147],72:[2,147],74:[2,147],76:[2,147],77:[2,147],81:[2,147],88:[2,147],89:[2,147],90:[2,147],95:[2,147],97:[2,147],106:[2,147],108:[2,147],109:[2,147],110:[2,147],114:[2,147],122:[2,147],130:[2,147],132:[2,147],133:[2,147],136:[2,147],137:[2,147],138:[2,147],139:[2,147],140:[2,147],141:[2,147]},{1:[2,124],6:[2,124],28:[2,124],29:[2,124],52:[2,124],57:[2,124],60:[2,124],69:[2,124],70:[2,124],71:[2,124],72:[2,124],74:[2,124],76:[2,124],77:[2,124],81:[2,124],88:[2,124],89:[2,124],90:[2,124],95:[2,124],97:[2,124],106:[2,124],108:[2,124],109:[2,124],110:[2,124],114:[2,124],122:[2,124],130:[2,124],132:[2,124],133:[2,124],136:[2,124],137:[2,124],138:[2,124],139:[2,124],140:[2,124],141:[2,124]},{6:[2,131],28:[2,131],29:[2,131],57:[2,131],90:[2,131],95:[2,131]},{6:[2,56],28:[2,56],29:[2,56],56:327,57:[1,234]},{6:[2,132],28:[2,132],29:[2,132],57:[2,132],90:[2,132],95:[2,132]},{1:[2,173],6:[2,173],28:[2,173],29:[2,173],52:[2,173],57:[2,173],60:[2,173],76:[2,173],81:[2,173],90:[2,173],95:[2,173],97:[2,173],106:[2,173],107:86,108:[2,173],109:[2,173],110:[2,173],113:87,114:[2,173],115:71,122:[1,328],130:[2,173],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,175],6:[2,175],28:[2,175],29:[2,175],52:[2,175],57:[2,175],60:[2,175],76:[2,175],81:[2,175],90:[2,175],95:[2,175],97:[2,175],106:[2,175],107:86,108:[2,175],109:[1,329],110:[2,175],113:87,114:[2,175],115:71,122:[2,175],130:[2,175],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,174],6:[2,174],28:[2,174],29:[2,174],52:[2,174],57:[2,174],60:[2,174],76:[2,174],81:[2,174],90:[2,174],95:[2,174],97:[2,174],106:[2,174],107:86,108:[2,174],109:[2,174],110:[2,174],113:87,114:[2,174],115:71,122:[2,174],130:[2,174],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[2,98],28:[2,98],29:[2,98],57:[2,98],81:[2,98]},{6:[2,56],28:[2,56],29:[2,56],56:330,57:[1,244]},{29:[1,331],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,255],28:[1,256],29:[1,332]},{29:[1,333]},{1:[2,181],6:[2,181],28:[2,181],29:[2,181],52:[2,181],57:[2,181],60:[2,181],76:[2,181],81:[2,181],90:[2,181],95:[2,181],97:[2,181],106:[2,181],108:[2,181],109:[2,181],110:[2,181],114:[2,181],122:[2,181],130:[2,181],132:[2,181],133:[2,181],136:[2,181],137:[2,181],138:[2,181],139:[2,181],140:[2,181],141:[2,181]},{29:[2,185],125:[2,185],127:[2,185]},{28:[2,137],57:[2,137],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,278],28:[1,279],29:[1,334]},{7:335,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:336,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[1,289],28:[1,290],29:[1,337]},{6:[2,44],28:[2,44],29:[2,44],57:[2,44],81:[2,44]},{6:[2,62],28:[2,62],29:[2,62],52:[2,62],57:[2,62]},{1:[2,179],6:[2,179],28:[2,179],29:[2,179],52:[2,179],57:[2,179],60:[2,179],76:[2,179],81:[2,179],90:[2,179],95:[2,179],97:[2,179],106:[2,179],108:[2,179],109:[2,179],110:[2,179],114:[2,179],122:[2,179],130:[2,179],132:[2,179],133:[2,179],136:[2,179],137:[2,179],138:[2,179],139:[2,179],140:[2,179],141:[2,179]},{6:[2,133],28:[2,133],29:[2,133],57:[2,133],90:[2,133],95:[2,133]},{1:[2,176],6:[2,176],28:[2,176],29:[2,176],52:[2,176],57:[2,176],60:[2,176],76:[2,176],81:[2,176],90:[2,176],95:[2,176],97:[2,176],106:[2,176],107:86,108:[2,176],109:[2,176],110:[2,176],113:87,114:[2,176],115:71,122:[2,176],130:[2,176],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,177],6:[2,177],28:[2,177],29:[2,177],52:[2,177],57:[2,177],60:[2,177],76:[2,177],81:[2,177],90:[2,177],95:[2,177],97:[2,177],106:[2,177],107:86,108:[2,177],109:[2,177],110:[2,177],113:87,114:[2,177],115:71,122:[2,177],130:[2,177],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[2,99],28:[2,99],29:[2,99],57:[2,99],81:[2,99]}],defaultActions:{62:[2,54],63:[2,55],93:[2,114],194:[2,93]},parseError:function(e,t){if(!t.recoverable)throw Error(e);
this.trace(e)},parse:function(e){function t(){var e;return e=n.lexer.lex()||p,"number"!=typeof e&&(e=n.symbols_[e]||e),e}var n=this,i=[0],r=[null],s=[],o=this.table,a="",c=0,u=0,h=0,l=2,p=1,d=s.slice.call(arguments,1);this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,this.lexer.yylloc===void 0&&(this.lexer.yylloc={});var f=this.lexer.yylloc;s.push(f);var m=this.lexer.options&&this.lexer.options.ranges;this.parseError="function"==typeof this.yy.parseError?this.yy.parseError:Object.getPrototypeOf(this).parseError;for(var w,g,b,v,y,k,_,C,F,T={};;){if(b=i[i.length-1],this.defaultActions[b]?v=this.defaultActions[b]:((null===w||w===void 0)&&(w=t()),v=o[b]&&o[b][w]),v===void 0||!v.length||!v[0]){var L="";F=[];for(k in o[b])this.terminals_[k]&&k>l&&F.push("'"+this.terminals_[k]+"'");L=this.lexer.showPosition?"Parse error on line "+(c+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+F.join(", ")+", got '"+(this.terminals_[w]||w)+"'":"Parse error on line "+(c+1)+": Unexpected "+(w==p?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(L,{text:this.lexer.match,token:this.terminals_[w]||w,line:this.lexer.yylineno,loc:f,expected:F})}if(v[0]instanceof Array&&v.length>1)throw Error("Parse Error: multiple actions possible at state: "+b+", token: "+w);switch(v[0]){case 1:i.push(w),r.push(this.lexer.yytext),s.push(this.lexer.yylloc),i.push(v[1]),w=null,g?(w=g,g=null):(u=this.lexer.yyleng,a=this.lexer.yytext,c=this.lexer.yylineno,f=this.lexer.yylloc,h>0&&h--);break;case 2:if(_=this.productions_[v[1]][1],T.$=r[r.length-_],T._$={first_line:s[s.length-(_||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(_||1)].first_column,last_column:s[s.length-1].last_column},m&&(T._$.range=[s[s.length-(_||1)].range[0],s[s.length-1].range[1]]),y=this.performAction.apply(T,[a,u,c,this.yy,v[1],r,s].concat(d)),y!==void 0)return y;_&&(i=i.slice(0,2*-1*_),r=r.slice(0,-1*_),s=s.slice(0,-1*_)),i.push(this.productions_[v[1]][0]),r.push(T.$),s.push(T._$),C=o[i[i.length-2]][i[i.length-1]],i.push(C);break;case 3:return!0}}return!0}};return e.prototype=t,t.Parser=e,new e}();return require!==void 0&&e!==void 0&&(e.parser=n,e.Parser=n.Parser,e.parse=function(){return n.parse.apply(n,arguments)},e.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var n=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return e.parser.parse(n)},t!==void 0&&require.main===t&&e.main(process.argv.slice(1))),t.exports}(),require["./iced"]=function(){var e={},t={exports:e};return function(){var t,n=[].slice;e.generator=t=function(e,t,i){var r,s,o,a,c,u;return t.transform=function(e,t){return e.icedTransform(t)},t["const"]=r={k:"__iced_k",k_noop:"__iced_k_noop",param:"__iced_p_",ns:"iced",runtime:"runtime",Deferrals:"Deferrals",deferrals:"__iced_deferrals",fulfill:"_fulfill",b_while:"_break",t_while:"_while",c_while:"_continue",n_while:"_next",n_arg:"__iced_next_arg",context:"context",defer_method:"defer",slot:"__slot",assign_fn:"assign_fn",autocb:"autocb",retslot:"ret",trace:"__iced_trace",passed_deferral:"__iced_passed_deferral",findDeferral:"findDeferral",lineno:"lineno",parent:"parent",filename:"filename",funcname:"funcname",catchExceptions:"catchExceptions",runtime_modes:["node","inline","window","none","browserify"],trampoline:"trampoline"},e.makeDeferReturn=function(t,i,s,o,a){var c,u,h,l;h={};for(c in o)l=o[c],h[c]=l;return h[r.lineno]=null!=i?i[r.lineno]:void 0,u=function(){var r,o,c;return r=arguments.length>=1?n.call(arguments,0):[],null!=i&&null!=(c=i.assign_fn)&&c.apply(null,r),t?(o=t,a||(t=null),o._fulfill(s,h)):e._warn("overused deferral at "+e._trace_to_string(h))},u[r.trace]=h,u},e.__c=0,e.tickCounter=function(t){return e.__c++,0===e.__c%t?(e.__c=0,!0):!1},e.__active_trace=null,e._trace_to_string=function(e){var t;return t=e[r.funcname]||"<anonymous>",""+t+" ("+e[r.filename]+":"+(e[r.lineno]+1)+")"},e._warn=function(e){return"undefined"!=typeof console&&null!==console?console.log("ICED warning: "+e):void 0},i.trampoline=function(t){return e.tickCounter(500)?"undefined"!=typeof process&&null!==process?process.nextTick(t):setTimeout(t):t()},i.Deferrals=s=function(){function t(e,t){this.trace=t,this.continuation=e,this.count=1,this.ret=null}return t.prototype._call=function(t){var n;return this.continuation?(e.__active_trace=t,n=this.continuation,this.continuation=null,n(this.ret)):e._warn("Entered dead await at "+e._trace_to_string(t))},t.prototype._fulfill=function(e,t){return--this.count>0?void 0:i.trampoline(function(e){return function(){return e._call(t)}}(this))},t.prototype.defer=function(t){var n;return this.count++,n=this,e.makeDeferReturn(n,t,null,this.trace)},t.prototype._defer=function(e){return this.defer(e)},t}(),i.findDeferral=c=function(e){var t,n,i;for(n=0,i=e.length;i>n;n++)if(t=e[n],null!=t?t[r.trace]:void 0)return t;return null},i.Rendezvous=o=function(){function t(){this.completed=[],this.waiters=[],this.defer_id=0}var n;return n=function(){function e(e,t,n){this.rv=e,this.id=t,this.multi=n}return e.prototype.defer=function(e){return this.rv._deferWithId(this.id,e,this.multi)},e}(),t.prototype.wait=function(e){var t;return this.completed.length?(t=this.completed.shift(),e(t)):this.waiters.push(e)},t.prototype.defer=function(e){var t;return t=this.defer_id++,this.deferWithId(t,e)},t.prototype.id=function(e,t){return null==t&&(t=!1),new n(this,e,t)},t.prototype._fulfill=function(e){var t;return this.waiters.length?(t=this.waiters.shift(),t(e)):this.completed.push(e)},t.prototype._deferWithId=function(t,n,i){return this.count++,e.makeDeferReturn(this,n,t,{},i)},t}(),i.stackWalk=u=function(t){var n,i,s,o;for(i=[],s=t?t[r.trace]:e.__active_trace;s;)n="   at "+e._trace_to_string(s),i.push(n),s=null!=s?null!=(o=s[r.parent])?o[r.trace]:void 0:void 0;return i},i.exceptionHandler=a=function(e,t){var n;return t||(t=console.log),t(e.stack),n=u(),n.length?(t("Iced callback trace:"),t(n.join("\n"))):void 0},i.catchExceptions=function(e){return"undefined"!=typeof process&&null!==process?process.on("uncaughtException",function(t){return a(t,e),process.exit(1)}):void 0}},e.runtime={},t(this,e,e.runtime)}.call(this),t.exports}(),require["./scope"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s;s=require("./helpers"),n=s.extend,r=s.last,i=require("./iced"),e.Scope=t=function(){function e(t,n,i){this.parent=t,this.expressions=n,this.method=i,this.variables=[{name:"arguments",type:"arguments"}],this.positions={},this.parent||(e.root=this)}return e.root=null,e.prototype.add=function(e,t,n){return this.shared&&!n?this.parent.add(e,t,n):Object.prototype.hasOwnProperty.call(this.positions,e)?this.variables[this.positions[e]].type=t:this.positions[e]=this.variables.push({name:e,type:t})-1},e.prototype.namedMethod=function(){var e;return(null!=(e=this.method)?e.name:void 0)||!this.parent?this.method:this.parent.namedMethod()},e.prototype.find=function(e){return this.check(e)?!0:(this.add(e,"var"),!1)},e.prototype.parameter=function(e){return this.shared&&this.parent.check(e,!0)?void 0:this.add(e,"param")},e.prototype.check=function(e){var t;return!!(this.type(e)||(null!=(t=this.parent)?t.check(e):void 0))},e.prototype.temporary=function(e,t){return e.length>1?"_"+e+(t>1?t-1:""):"_"+(t+parseInt(e,36)).toString(36).replace(/\d/g,"a")},e.prototype.type=function(e){var t,n,i,r;for(r=this.variables,n=0,i=r.length;i>n;n++)if(t=r[n],t.name===e)return t.type;return null},e.prototype.freeVariable=function(e,t){var n,i;for(null==t&&(t=!0),n=0;this.check(i=this.temporary(e,n));)n++;return t&&this.add(i,"var",!0),i},e.prototype.assign=function(e,t){return this.add(e,{value:t,assigned:!0},!0),this.hasAssignments=!0},e.prototype.hasDeclarations=function(){return!!this.declaredVariables().length},e.prototype.declaredVariables=function(){var e,t,n,r,s,o;for(e=[],t=[],o=this.variables,r=0,s=o.length;s>r;r++)n=o[r],("var"===n.type||"param"===n.type&&n.name===i["const"].k)&&("_"===n.name.charAt(0)?t:e).push(n.name);return e.sort().concat(t.sort())},e.prototype.assignedVariables=function(){var e,t,n,i,r;for(i=this.variables,r=[],t=0,n=i.length;n>t;t++)e=i[t],e.type.assigned&&r.push(""+e.name+" = "+e.type.value);return r},e}()}.call(this),t.exports}(),require["./nodes"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,u,h,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,L,N,x,D,E,S,A,R,I,$,O,j,P,B,V,M,H,U,W,q,G,X,Y,z,K,J,Q,Z,et,tt,nt,it,rt,st,ot,at,ct,ut,ht,lt,pt,dt,ft,mt,wt,gt,bt,vt,yt,kt,_t,Ct,Ft,Tt,Lt,Nt,xt,Dt,Et,St,At={}.hasOwnProperty,Rt=function(e,t){function n(){this.constructor=e}for(var i in t)At.call(t,i)&&(e[i]=t[i]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},It=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},$t=[].slice;Error.stackTraceLimit=1/0,J=require("./scope").Scope,Et=require("./lexer"),G=Et.RESERVED,K=Et.STRICT_PROSCRIBED,gt=require("./iced"),St=require("./helpers"),lt=St.compact,mt=St.flatten,ft=St.extend,_t=St.merge,pt=St.del,Lt=St.starts,dt=St.ends,yt=St.last,Tt=St.some,ht=St.addLocationDataFn,kt=St.locationDataToString,Nt=St.throwSyntaxError,e.extend=ft,e.addLocationDataFn=ht,ut=function(){return!0},B=function(){return!1},it=function(){return this},P=function(){return this.negated=!this.negated,this},V=function(){return new at(new O("null"))},e.CodeFragment=l=function(){function e(e,t){var n;this.code=""+t,this.locationData=null!=e?e.locationData:void 0,this.type=(null!=e?null!=(n=e.constructor)?n.name:void 0:void 0)||"unknown"}return e.prototype.toString=function(){return""+this.code+(this.locationData?": "+kt(this.locationData):"")},e}(),wt=function(e){var t;return function(){var n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],r.push(t.code);return r}().join("")},e.Base=s=function(){function e(){this.icedContinuationBlock=null,this.icedLoopFlag=!1,this.icedNodeFlag=!1,this.icedGotCpsSplitFlag=!1,this.icedCpsPivotFlag=!1,this.icedHasAutocbFlag=!1,this.icedFoundArguments=!1,this.icedParentAwait=null,this.icedCallContinuationFlag=!1}return e.prototype.compile=function(e,t){return wt(this.compileToFragments(e,t))},e.prototype.compileToFragments=function(e,t){var n;return e=ft({},e),t&&(e.level=t),n=this.unfoldSoak(e)||this,n.tab=e.indent,n.icedHasContinuation()&&!n.icedGotCpsSplitFlag?n.icedCompileCps(e):e.level!==$&&n.isStatement(e)?n.compileClosure(e):n.compileNode(e)},e.prototype.compileClosure=function(e){var n,i,r,s,c;return(s=this.jumps())&&s.error("cannot use a pure statement in an expression"),e.sharedScope=!0,this.icedClearAutocbFlags(),r=new h([],o.wrap([this])),n=[],((i=this.contains(bt))||this.contains(vt))&&(n=[new O("this")],i?(c="apply",n.push(new O("arguments"))):c="call",r=new at(r,[new t(new O(c))])),new a(r,n).compileNode(e)},e.prototype.cache=function(e,t,n){var r,s;return this.isComplex()?(r=new O(n||e.scope.freeVariable("ref")),s=new i(r,this),t?[s.compileToFragments(e,t),[this.makeCode(r.value)]]:[s,r]):(r=t?this.compileToFragments(e,t):this,[r,r])},e.prototype.cacheToCodeFragments=function(e){return[wt(e[0]),wt(e[1])]},e.prototype.makeReturn=function(e){var t;return t=this.unwrapAll(),e?new a(new O(""+e+".push"),[t]):new Y(t,this.icedHasAutocbFlag)},e.prototype.contains=function(e){var t;return t=void 0,this.traverseChildren(!1,function(n){return e(n)?(t=n,!1):void 0}),t},e.prototype.lastNonComment=function(e){var t;for(t=e.length;t--;)if(!(e[t]instanceof p))return e[t];return null},e.prototype.toString=function(e,t){var n,i;return null==e&&(e=""),null==t&&(t=this.constructor.name),n=[],this.icedNodeFlag&&n.push("A"),this.icedLoopFlag&&n.push("L"),this.icedCpsPivotFlag&&n.push("P"),this.icedHasAutocbFlag&&n.push("C"),this.icedParentAwait&&n.push("D"),this.icedFoundArguments&&n.push("G"),n.length&&(n=" ("+n.join("")+")"),i="\n"+e+t,i="\n"+e+t,this.soak&&(i+="?"),i+=n,this.eachChild(function(t){return i+=t.toString(e+nt)}),this.icedContinuationBlock&&(e+=nt,i+="\n"+e+"Continuation",i+=this.icedContinuationBlock.toString(e+nt)),i},e.prototype.eachChild=function(e){var t,n,i,r,s,o,a,c;if(!this.children)return this;for(a=this.children,i=0,s=a.length;s>i;i++)if(t=a[i],this[t])for(c=mt([this[t]]),r=0,o=c.length;o>r;r++)if(n=c[r],e(n)===!1)return this;return this},e.prototype.traverseChildren=function(e,t){return this.eachChild(function(n){var i;return i=t(n),i!==!1?n.traverseChildren(e,t):void 0})},e.prototype.invert=function(){return new U("!",this)},e.prototype.unwrapAll=function(){var e;for(e=this;e!==(e=e.unwrap()););return e},e.prototype.flattenChildren=function(){var e,t,n,i,r,s,o,a,c;for(n=[],a=this.children,i=0,s=a.length;s>i;i++)if(e=a[i],this[e])for(c=mt([this[e]]),r=0,o=c.length;o>r;r++)t=c[r],n.push(t);return n},e.prototype.icedCompileCps=function(e){var t;return this.icedGotCpsSplitFlag=!0,t=d.wrap(this,this.icedContinuationBlock,null,e),e.sharedScope=!0,t.compileNode(e)},e.prototype.icedWalkAst=function(e,t){var n,i,r,s;for(this.icedParentAwait=e,this.icedHasAutocbFlag=t.foundAutocb,s=this.flattenChildren(),i=0,r=s.length;r>i;i++)n=s[i],n.icedWalkAst(e,t)&&(this.icedNodeFlag=!0);return this.icedNodeFlag},e.prototype.icedWalkAstLoops=function(e){var t,n,i,r;for(this.isLoop()&&this.icedNodeFlag&&(e=!0),this.isLoop()&&!this.icedNodeFlag&&(e=!1),this.icedLoopFlag=e,r=this.flattenChildren(),n=0,i=r.length;i>n;n++)t=r[n],t.icedWalkAstLoops(e)&&(this.icedLoopFlag=!0);return this.icedLoopFlag},e.prototype.icedWalkCpsPivots=function(){var e,t,n,i;for((this.icedNodeFlag||this.icedLoopFlag&&this.icedIsJump())&&(this.icedCpsPivotFlag=!0),i=this.flattenChildren(),t=0,n=i.length;n>t;t++)e=i[t],e.icedWalkCpsPivots()&&(this.icedCpsPivotFlag=!0);return this.icedCpsPivotFlag},e.prototype.icedClearAutocbFlags=function(){return this.icedHasAutocbFlag=!1,this.traverseChildren(!1,function(e){return e.icedHasAutocbFlag=!1,!0})},e.prototype.icedCpsRotate=function(){var e,t,n,i;for(i=this.flattenChildren(),t=0,n=i.length;n>t;t++)e=i[t],e.icedCpsRotate();return this},e.prototype.icedIsCpsPivot=function(){return this.icedCpsPivotFlag},e.prototype.icedNestContinuationBlock=function(e){return this.icedContinuationBlock=e},e.prototype.icedHasContinuation=function(){return!!this.icedContinuationBlock},e.prototype.icedCallContinuation=function(){return this.icedCallContinuationFlag=!0},e.prototype.icedWrapContinuation=B,e.prototype.icedIsJump=B,e.prototype.icedUnwrap=function(e){return e.icedHasContinuation()&&this.icedHasContinuation()?this:(this.icedHasContinuation()&&(e.icedContinuationBlock=this.icedContinuationBlock),e)},e.prototype.icedStatementAssertion=function(){return this.icedIsCpsPivot()?this.error("await'ed statements can't act as expressions"):void 0},e.prototype.children=[],e.prototype.isStatement=B,e.prototype.jumps=B,e.prototype.isComplex=ut,e.prototype.isChainable=B,e.prototype.isAssignable=B,e.prototype.isLoop=B,e.prototype.unwrap=it,e.prototype.unfoldSoak=B,e.prototype.assigns=B,e.prototype.updateLocationDataIfMissing=function(e){return this.locationData?this:(this.locationData=e,this.eachChild(function(t){return t.updateLocationDataIfMissing(e)}))},e.prototype.error=function(e){return Nt(e,this.locationData)},e.prototype.makeCode=function(e){return new l(this,e)},e.prototype.wrapInBraces=function(e){return[].concat(this.makeCode("("),e,this.makeCode(")"))},e.prototype.joinFragmentArrays=function(e,t){var n,i,r,s,o;for(n=[],r=s=0,o=e.length;o>s;r=++s)i=e[r],r&&n.push(this.makeCode(t)),n=n.concat(i);return n},e}(),e.Block=o=function(e){function t(e){t.__super__.constructor.call(this),this.expressions=lt(mt(e||[]))}return Rt(t,e),t.prototype.children=["expressions"],t.prototype.push=function(e){return this.expressions.push(e),this},t.prototype.pop=function(){return this.expressions.pop()},t.prototype.unshift=function(e){return this.expressions.unshift(e),this},t.prototype.unwrap=function(){return 1===this.expressions.length?this.icedUnwrap(this.expressions[0]):this},t.prototype.isEmpty=function(){return!this.expressions.length},t.prototype.isStatement=function(e){var t,n,i,r;for(r=this.expressions,n=0,i=r.length;i>n;n++)if(t=r[n],t.isStatement(e))return!0;return!1},t.prototype.jumps=function(e){var t,n,i,r,s;for(s=this.expressions,i=0,r=s.length;r>i;i++)if(t=s[i],n=t.jumps(e))return n},t.prototype.makeReturn=function(e){var t,n,i;for(i=this.expressions.length,n=!1;i--;)if(t=this.expressions[i],!(t instanceof p)){this.expressions[i]=t.makeReturn(e),t instanceof Y&&!t.expression&&!t.icedHasAutocbFlag?(this.expressions.splice(i,1),n=!0):t instanceof L&&!t.elseBody||(n=!0);break}return!this.icedHasAutocbFlag||this.icedNodeFlag||n||this.expressions.push(new Y(null,!0)),this},t.prototype.compileToFragments=function(e,n){return null==e&&(e={}),e.scope?t.__super__.compileToFragments.call(this,e,n):this.compileRoot(e)},t.prototype.compileNode=function(e){var n,i,r,s,o,a,c,u,h;for(this.tab=e.indent,a=e.level===$,i=[],h=this.expressions,s=c=0,u=h.length;u>c;s=++c)o=h[s],o=o.unwrapAll(),o=o.unfoldSoak(e)||o,o instanceof t?i.push(o.compileNode(e)):a?(o.front=!0,r=o.compileToFragments(e),o.isStatement(e)||(r.unshift(this.makeCode(""+this.tab)),r.push(this.makeCode(";"))),i.push(r)):i.push(o.compileToFragments(e,A));return a?this.spaced?[].concat(this.joinFragmentArrays(i,"\n\n"),this.makeCode("\n")):this.joinFragmentArrays(i,"\n"):(n=i.length?this.joinFragmentArrays(i,", "):[this.makeCode("void 0")],i.length>1&&e.level>=A?this.wrapInBraces(n):n)},t.prototype.compileRoot=function(e){var t,n,i,r,s,o,a,c,u,h;for(e.indent=e.bare?"":nt,e.level=$,this.spaced=!0,e.scope=new J(null,this,null),h=e.locals||[],c=0,u=h.length;u>c;c++)r=h[c],e.scope.parameter(r);return s=[],e.bare||(o=function(){var e,n,r,s;for(r=this.expressions,s=[],i=e=0,n=r.length;n>e&&(t=r[i],t.unwrap()instanceof p);i=++e)s.push(t);return s}.call(this),a=this.expressions.slice(o.length),this.expressions=o,o.length&&(s=this.compileNode(_t(e,{indent:""})),s.push(this.makeCode("\n"))),this.expressions=a),n=this.compileWithDeclarations(e),e.bare?n:[].concat(s,this.makeCode("(function() {\n"),n,this.makeCode("\n}).call(this);\n"))},t.prototype.compileWithDeclarations=function(e){var t,n,i,r,s,o,a,c,u,h,l,d,f,m;for(r=[],o=[],d=this.expressions,s=h=0,l=d.length;l>h&&(i=d[s],i=i.unwrap(),i instanceof p||i instanceof O);s=++h);return e=_t(e,{level:$}),s&&(a=this.expressions.splice(s,9e9),f=[this.spaced,!1],u=f[0],this.spaced=f[1],m=[this.compileNode(e),u],r=m[0],this.spaced=m[1],this.expressions=a),o=this.compileNode(e),c=e.scope,c.expressions===this&&(n=e.scope.hasDeclarations(),t=c.hasAssignments,n||t?(s&&r.push(this.makeCode("\n")),r.push(this.makeCode(""+this.tab+"var ")),n&&r.push(this.makeCode(c.declaredVariables().join(", "))),t&&(n&&r.push(this.makeCode(",\n"+(this.tab+nt))),r.push(this.makeCode(c.assignedVariables().join(",\n"+(this.tab+nt))))),r.push(this.makeCode(";\n"+(this.spaced?"\n":"")))):r.length&&o.length&&r.push(this.makeCode("\n"))),r.concat(o)},t.wrap=function(e){return 1===e.length&&e[0]instanceof t?e[0]:new t(e)},t.prototype.icedThreadReturn=function(e){var t,n;for(e=e||new T,n=this.expressions.length;n--&&(t=this.expressions[n],!t.isStatement());)if(!(t instanceof p||t instanceof Y))return e.assignValue(t),this.expressions[n]=e,void 0;return this.expressions.push(e)},t.prototype.icedCompileCps=function(e){return this.icedGotCpsSplitFlag=!0,this.expressions.length>1?t.__super__.icedCompileCps.call(this,e):this.compileNode(e)},t.prototype.icedCpsRotate=function(){var e,n,i,r,s,o,a,c,u,h;for(r=null,h=this.expressions,i=o=0,c=h.length;c>o&&(n=h[i],n.icedIsCpsPivot()&&(r=n,r.icedCallContinuation()),n.icedCpsRotate(),!r);i=++o);if(!r)return this;if(r.icedContinuationBlock)throw SyntaxError("unexpected continuation block in node");if(s=this.expressions.slice(i+1),this.expressions=this.expressions.slice(0,i+1),s.length){for(e=new t(s),r.icedNestContinuationBlock(e),a=0,u=s.length;u>a;a++)n=s[a],n.icedNodeFlag&&(e.icedNodeFlag=!0),n.icedLoopFlag&&(e.icedLoopFlag=!0),n.icedCpsPivotFlag&&(e.icedCpsPivotFlag=!0),n.icedHasAutocbFlag&&(e.icedHasAutocbFlag=!0);e.icedCpsRotate()}return this},t.prototype.icedAddRuntime=function(e,t){var n,i;for(n=0;(i=this.expressions[n])&&i instanceof p||i instanceof at&&i.isString();)n++;return this.expressions.splice(n,0,new F(e,t))},t.prototype.icedTransform=function(e){var t;return t={},this.icedWalkAst(null,t),!(null!=e?e.repl:void 0)&&(t.foundDefer||t.foundAwait||e.runforce)&&this.icedAddRuntime(t.foundDefer,t.foundAwait),t.foundAwait&&(this.icedWalkAstLoops(!1),this.icedWalkCpsPivots(),this.icedCpsRotate()),this},t.prototype.icedGetSingle=function(){return 1===this.expressions.length?this.expressions[0]:null},t}(s),e.Literal=O=function(e){function t(e){this.value=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.makeReturn=function(){return this.isStatement()?this:t.__super__.makeReturn.apply(this,arguments)},t.prototype.isAssignable=function(){return v.test(this.value)},t.prototype.isStatement=function(){var e;return"break"===(e=this.value)||"continue"===e||"debugger"===e},t.prototype.isComplex=B,t.prototype.assigns=function(e){return e===this.value},t.prototype.jumps=function(e){return"break"!==this.value||(null!=e?e.loop:void 0)||(null!=e?e.block:void 0)?"continue"!==this.value||(null!=e?e.loop:void 0)?void 0:this:this},t.prototype.compileNode=function(e){var t,n,i;return this.icedLoopFlag&&this.icedIsJump()?this.icedCompileIced(e):(n="this"===this.value?(null!=(i=e.scope.method)?i.bound:void 0)?e.scope.method.context:this.value:this.value.reserved?'"'+this.value+'"':this.value,t=this.isStatement()?""+this.tab+n+";":n,[this.makeCode(t)])},t.prototype.toString=function(){return' "'+this.value+'"'},t.prototype.icedWalkAst=function(e,t){return"arguments"===this.value&&t.foundAwaitFunc&&(t.foundArguments=!0,this.value="_arguments"),!1},t.prototype.icedIsJump=function(){return this.isStatement()},t.prototype.icedCompileIced=function(e){var n,i,r,s;return i={"continue":gt["const"].c_while,"break":gt["const"].b_while},s=i[this.value],r=new at(new t(s)),n=new a(r,[]),n.compileNode(e)},t}(s),e.Undefined=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Rt(t,e),t.prototype.isAssignable=B,t.prototype.isComplex=B,t.prototype.compileNode=function(e){return[this.makeCode(e.level>=E?"(void 0)":"void 0")]},t}(s),e.Null=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Rt(t,e),t.prototype.isAssignable=B,t.prototype.isComplex=B,t.prototype.compileNode=function(){return[this.makeCode("null")]},t}(s),e.Bool=function(e){function t(e){this.val=e}return Rt(t,e),t.prototype.isAssignable=B,t.prototype.isComplex=B,t.prototype.compileNode=function(){return[this.makeCode(this.val)]},t}(s),e.Return=Y=function(e){function t(e,n){t.__super__.constructor.call(this),this.icedHasAutocbFlag=n,e&&!e.unwrap().isUndefined&&(this.expression=e)}return Rt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=ut,t.prototype.makeReturn=it,t.prototype.jumps=it,t.prototype.compileToFragments=function(e,n){var i,r;return i=null!=(r=this.expression)?r.makeReturn():void 0,!i||i instanceof t?t.__super__.compileToFragments.call(this,e,n):i.compileToFragments(e,n)},t.prototype.compileNode=function(e){var t;return this.icedHasAutocbFlag?this.icedCompileIced(e):(t=[],t.push(this.makeCode(this.tab+("return"+(this.expression?" ":"")))),this.expression&&(t=t.concat(this.expression.compileToFragments(e,I))),t.push(this.makeCode(";")),t)},t.prototype.icedCompileIced=function(e){var t,n,i,r,s;return r=new at(new O(gt["const"].autocb)),t=this.expression?[this.expression]:[],i=new a(r,t),s=new O("return"),n=new o([i,s]),n.compileNode(e)},t}(s),e.Value=at=function(e){function r(e,t,n){return r.__super__.constructor.call(this),!t&&e instanceof r?e:(this.base=e,this.properties=t||[],n&&(this[n]=!0),this)}return Rt(r,e),r.prototype.children=["base","properties"],r.prototype.copy=function(){return new r(this.base,this.properties)},r.prototype.add=function(e){return this.properties=this.properties.concat(e),this},r.prototype.hasProperties=function(){return!!this.properties.length},r.prototype.bareLiteral=function(e){return!this.properties.length&&this.base instanceof e},r.prototype.isArray=function(){return this.bareLiteral(n)},r.prototype.isRange=function(){return this.bareLiteral(X)},r.prototype.isComplex=function(){return this.hasProperties()||this.base.isComplex()},r.prototype.isAssignable=function(){return this.hasProperties()||this.base.isAssignable()},r.prototype.isSimpleNumber=function(){return this.bareLiteral(O)&&z.test(this.base.value)},r.prototype.isString=function(){return this.bareLiteral(O)&&_.test(this.base.value)},r.prototype.isRegex=function(){return this.bareLiteral(O)&&k.test(this.base.value)},r.prototype.isAtomic=function(){var e,t,n,i;for(i=this.properties.concat(this.base),t=0,n=i.length;n>t;t++)if(e=i[t],e.soak||e instanceof a)return!1;return!0},r.prototype.isNotCallable=function(){return this.isSimpleNumber()||this.isString()||this.isRegex()||this.isArray()||this.isRange()||this.isSplice()||this.isObject()},r.prototype.isStatement=function(e){return!this.properties.length&&this.base.isStatement(e)},r.prototype.assigns=function(e){return!this.properties.length&&this.base.assigns(e)},r.prototype.jumps=function(e){return!this.properties.length&&this.base.jumps(e)},r.prototype.isObject=function(e){return this.properties.length?!1:this.base instanceof H&&(!e||this.base.generated)},r.prototype.isSplice=function(){return yt(this.properties)instanceof Q},r.prototype.looksStatic=function(e){var t;return this.base.value===e&&this.properties.length&&"prototype"!==(null!=(t=this.properties[0].name)?t.value:void 0)},r.prototype.unwrap=function(){return this.properties.length?this:this.base},r.prototype.cacheReference=function(e){var t,n,s,o;return s=yt(this.properties),2>this.properties.length&&!this.base.isComplex()&&!(null!=s?s.isComplex():void 0)?[this,this]:(t=new r(this.base,this.properties.slice(0,-1)),t.isComplex()&&(n=new O(e.scope.freeVariable("base")),t=new r(new q(new i(n,t)))),s?(s.isComplex()&&(o=new O(e.scope.freeVariable("name")),s=new x(new i(o,s.index)),o=new x(o)),[t.add(s),new r(n||t.base,[o||s])]):[t,n])},r.prototype.compileNode=function(e){var t,n,i,r,s;for(this.base.front=this.front,i=this.properties,t=this.base.compileToFragments(e,i.length?E:null),(this.base instanceof q||i.length)&&z.test(wt(t))&&t.push(this.makeCode(".")),r=0,s=i.length;s>r;r++)n=i[r],t.push.apply(t,n.compileToFragments(e));return t},r.prototype.unfoldSoak=function(e){return null!=this.unfoldedSoak?this.unfoldedSoak:this.unfoldedSoak=function(t){return function(){var n,s,o,a,c,u,h,l,p,d;if(o=t.base.unfoldSoak(e))return(p=o.body.properties).push.apply(p,t.properties),o;for(d=t.properties,s=h=0,l=d.length;l>h;s=++h)if(a=d[s],a.soak)return a.soak=!1,n=new r(t.base,t.properties.slice(0,s)),u=new r(t.base,t.properties.slice(s)),n.isComplex()&&(c=new O(e.scope.freeVariable("ref")),n=new q(new i(c,n)),u.base=c),new L(new m(n),u,{soak:!0});return!1}}(this)()},r.prototype.icedToSlot=function(e){var t,n;return this.base instanceof H?this.base.icedToSlot(e):(t=null,this.properties&&this.properties.length&&(n=this.properties.pop()),new Z(e,this,n))},r.prototype.icedToSlotAccess=function(){return this["this"]?this.properties[0]:new t(this)},r}(s),e.Comment=p=function(e){function t(e){this.comment=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.isStatement=ut,t.prototype.makeReturn=it,t.prototype.compileNode=function(e,t){var n,i;return i=this.comment.replace(/^(\s*)#/gm,"$1 *"),n="/*"+Ct(i,this.tab)+(It.call(i,"\n")>=0?"\n"+this.tab:"")+" */",(t||e.level)===$&&(n=e.indent+n),[this.makeCode("\n"),this.makeCode(n)]},t}(s),e.Call=a=function(e){function n(e,t,i){this.args=null!=t?t:[],this.soak=i,n.__super__.constructor.call(this),this.isNew=!1,this.isSuper="super"===e,this.variable=this.isSuper?null:e,e instanceof at&&e.isNotCallable()&&e.error("literal is not a function")}return Rt(n,e),n.prototype.children=["variable","args"],n.prototype.newInstance=function(){var e,t;return e=(null!=(t=this.variable)?t.base:void 0)||this.variable,e instanceof n&&!e.isNew?e.newInstance():this.isNew=!0,this},n.prototype.superReference=function(e){var n,i;return i=e.scope.namedMethod(),(null!=i?i.klass:void 0)?(n=[new t(new O("__super__"))],i["static"]&&n.push(new t(new O("constructor"))),n.push(new t(new O(i.name))),new at(new O(i.klass),n).compile(e)):(null!=i?i.ctor:void 0)?""+i.name+".__super__.constructor":this.error("cannot call super outside of an instance method.")},n.prototype.superThis=function(e){var t;return e.scope.icedgen?"_this":(t=e.scope.method,t&&!t.klass&&t.context||"this")},n.prototype.unfoldSoak=function(e){var t,i,r,s,o,a,c,u,h;if(this.soak){if(this.variable){if(i=xt(e,this,"variable"))return i;u=new at(this.variable).cacheReference(e),r=u[0],o=u[1]}else r=new O(this.superReference(e)),o=new at(r);return o=new n(o,this.args),o.isNew=this.isNew,r=new O("typeof "+r.compile(e)+' === "function"'),new L(r,new at(o),{soak:!0})}for(t=this,s=[];;)if(t.variable instanceof n)s.push(t),t=t.variable;else{if(!(t.variable instanceof at))break;if(s.push(t),!((t=t.variable.base)instanceof n))break}for(h=s.reverse(),a=0,c=h.length;c>a;a++)t=h[a],i&&(t.variable instanceof n?t.variable=i:t.variable.base=i),i=xt(e,t,"variable");return i},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,u,h;if(null!=(u=this.variable)&&(u.front=this.front),r=et.compileSplattedArray(e,this.args,!0),r.length)return this.compileSplat(e,r);for(i=[],h=this.args,n=a=0,c=h.length;c>a;n=++a)t=h[n],t.icedStatementAssertion(),n&&i.push(this.makeCode(", ")),i.push.apply(i,t.compileToFragments(e,A));return s=[],this.isSuper?(o=this.superReference(e)+(".call("+this.superThis(e)),i.length&&(o+=", "),s.push(this.makeCode(o))):(this.isNew&&s.push(this.makeCode("new ")),s.push.apply(s,this.variable.compileToFragments(e,E)),s.push(this.makeCode("("))),s.push.apply(s,i),s.push(this.makeCode(")")),s},n.prototype.compileSplat=function(e,t){var n,i,r,s,o,a;return this.isSuper?[].concat(this.makeCode(""+this.superReference(e)+".apply("+this.superThis(e)+", "),t,this.makeCode(")")):this.isNew?(s=this.tab+nt,[].concat(this.makeCode("(function(func, args, ctor) {\n"+s+"ctor.prototype = func.prototype;\n"+s+"var child = new ctor, result = func.apply(child, args);\n"+s+"return Object(result) === result ? result : child;\n"+this.tab+"})("),this.variable.compileToFragments(e,A),this.makeCode(", "),t,this.makeCode(", function(){})"))):(n=[],i=new at(this.variable),(o=i.properties.pop())&&i.isComplex()?(a=e.scope.freeVariable("ref"),n=n.concat(this.makeCode("("+a+" = "),i.compileToFragments(e,A),this.makeCode(")"),o.compileToFragments(e))):(r=i.compileToFragments(e,E),z.test(wt(r))&&(r=this.wrapInBraces(r)),o?(a=wt(r),r.push.apply(r,o.compileToFragments(e))):a="null",n=n.concat(r)),n=n.concat(this.makeCode(".apply("+a+", "),t,this.makeCode(")")))},n}(s),e.Extends=w=function(e){function t(e,n){this.child=e,this.parent=n,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["child","parent"],t.prototype.compileToFragments=function(e){return new a(new at(new O(Dt("extends"))),[this.child,this.parent]).compileToFragments(e)},t}(s),e.Access=t=function(e){function t(e,n){this.name=e,t.__super__.constructor.call(this),this.name.asKey=!0,this.soak="soak"===n}return Rt(t,e),t.prototype.children=["name"],t.prototype.compileToFragments=function(e){var t;return t=this.name.compileToFragments(e),v.test(wt(t))||this.name instanceof f?t.unshift(this.makeCode(".")):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.isComplex=B,t}(s),e.Index=x=function(e){function t(e){this.index=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["index"],t.prototype.compileToFragments=function(e){return[].concat(this.makeCode("["),this.index.compileToFragments(e,I),this.makeCode("]"))},t.prototype.isComplex=function(){return this.index.isComplex()
},t}(s),e.Range=X=function(e){function t(e,n,i){this.from=e,this.to=n,t.__super__.constructor.call(this),this.exclusive="exclusive"===i,this.equals=this.exclusive?"":"="}return Rt(t,e),t.prototype.children=["from","to"],t.prototype.compileVariables=function(e){var t,n,i,r,s;return e=_t(e,{top:!0}),n=this.cacheToCodeFragments(this.from.cache(e,A)),this.fromC=n[0],this.fromVar=n[1],i=this.cacheToCodeFragments(this.to.cache(e,A)),this.toC=i[0],this.toVar=i[1],(t=pt(e,"step"))&&(r=this.cacheToCodeFragments(t.cache(e,A)),this.step=r[0],this.stepVar=r[1]),s=[this.fromVar.match(M),this.toVar.match(M)],this.fromNum=s[0],this.toNum=s[1],this.stepVar?this.stepNum=this.stepVar.match(M):void 0},t.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,u,h,l,p,d,f;return this.fromVar||this.compileVariables(e),e.index?(a=this.fromNum&&this.toNum,s=pt(e,"index"),o=pt(e,"name"),u=o&&o!==s,p=""+s+" = "+this.fromC,this.toC!==this.toVar&&(p+=", "+this.toC),this.step!==this.stepVar&&(p+=", "+this.step),d=[""+s+" <"+this.equals,""+s+" >"+this.equals],c=d[0],r=d[1],n=this.stepNum?Ft(this.stepNum[0])>0?""+c+" "+this.toVar:""+r+" "+this.toVar:a?(f=[Ft(this.fromNum[0]),Ft(this.toNum[0])],i=f[0],l=f[1],f,l>=i?""+c+" "+l:""+r+" "+l):(t=this.stepVar?""+this.stepVar+" > 0":""+this.fromVar+" <= "+this.toVar,""+t+" ? "+c+" "+this.toVar+" : "+r+" "+this.toVar),h=this.stepVar?""+s+" += "+this.stepVar:a?u?l>=i?"++"+s:"--"+s:l>=i?""+s+"++":""+s+"--":u?""+t+" ? ++"+s+" : --"+s:""+t+" ? "+s+"++ : "+s+"--",u&&(p=""+o+" = "+p),u&&(h=""+o+" = "+h),[this.makeCode(""+p+"; "+n+"; "+h)]):this.compileArray(e)},t.prototype.compileArray=function(e){var t,n,i,r,s,o,a,c,u,h,l,p,d;return this.fromNum&&this.toNum&&20>=Math.abs(this.fromNum-this.toNum)?(u=function(){d=[];for(var e=p=+this.fromNum,t=+this.toNum;t>=p?t>=e:e>=t;t>=p?e++:e--)d.push(e);return d}.apply(this),this.exclusive&&u.pop(),[this.makeCode("["+u.join(", ")+"]")]):(o=this.tab+nt,s=e.scope.freeVariable("i"),h=e.scope.freeVariable("results"),c="\n"+o+h+" = [];",this.fromNum&&this.toNum?(e.index=s,n=wt(this.compileNode(e))):(l=""+s+" = "+this.fromC+(this.toC!==this.toVar?", "+this.toC:""),i=""+this.fromVar+" <= "+this.toVar,n="var "+l+"; "+i+" ? "+s+" <"+this.equals+" "+this.toVar+" : "+s+" >"+this.equals+" "+this.toVar+"; "+i+" ? "+s+"++ : "+s+"--"),a="{ "+h+".push("+s+"); }\n"+o+"return "+h+";\n"+e.indent,r=function(e){return null!=e?e.contains(bt):void 0},(r(this.from)||r(this.to))&&(t=", arguments"),[this.makeCode("(function() {"+c+"\n"+o+"for ("+n+")"+a+"}).apply(this"+(null!=t?t:"")+")")])},t}(s),e.Slice=Q=function(e){function t(e){this.range=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["range"],t.prototype.compileNode=function(e){var t,n,i,r,s,o,a;return a=this.range,s=a.to,i=a.from,r=i&&i.compileToFragments(e,I)||[this.makeCode("0")],s&&(t=s.compileToFragments(e,I),n=wt(t),(this.range.exclusive||-1!==+n)&&(o=", "+(this.range.exclusive?n:z.test(n)?""+(+n+1):(t=s.compileToFragments(e,E),"+"+wt(t)+" + 1 || 9e9")))),[this.makeCode(".slice("+wt(r)+(o||"")+")")]},t}(s),e.Obj=H=function(e){function t(e,n){this.generated=null!=n?n:!1,this.objects=this.properties=e||[],t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["properties"],t.prototype.compileNode=function(e){var t,n,r,s,o,a,c,u,h,l,d,f,m;if(h=this.properties,!h.length)return[this.makeCode(this.front?"({})":"{}")];if(this.generated)for(l=0,f=h.length;f>l;l++)c=h[l],c instanceof at&&c.error("cannot have an implicit value in an implicit object");for(r=e.indent+=nt,a=this.lastNonComment(this.properties),t=[],n=d=0,m=h.length;m>d;n=++d)u=h[n],o=n===h.length-1?"":u===a||u instanceof p?"\n":",\n",s=u instanceof p?"":r,u instanceof i&&u.variable instanceof at&&u.variable.hasProperties()&&u.variable.error("Invalid object key"),u instanceof at&&u["this"]&&(u=new i(u.properties[0].name,u,"object")),u instanceof p||(u instanceof i||(u=new i(u,u,"object")),(u.variable.base||u.variable).asKey=!0),s&&t.push(this.makeCode(s)),t.push.apply(t,u.compileToFragments(e,$)),o&&t.push(this.makeCode(o));return t.unshift(this.makeCode("{"+(h.length&&"\n"))),t.push(this.makeCode(""+(h.length&&"\n"+this.tab)+"}")),this.front?this.wrapInBraces(t):t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.properties,n=0,i=r.length;i>n;n++)if(t=r[n],t.assigns(e))return!0;return!1},t.prototype.icedToSlot=function(e){var t,n,r,s,o,a;for(o=this.properties,a=[],r=0,s=o.length;s>r;r++)n=o[r],n instanceof i?a.push(n.value.icedToSlot(e).addAccess(n.variable.icedToSlotAccess())):n instanceof at?(t=n.icedToSlotAccess(),a.push(n.icedToSlot(e).addAccess(t))):a.push(void 0);return a},t}(s),e.Arr=n=function(e){function t(e){this.objects=e||[],t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["objects"],t.prototype.compileNode=function(e){var t,n,i,r,s,o,a;if(!this.objects.length)return[this.makeCode("[]")];if(e.indent+=nt,t=et.compileSplattedArray(e,this.objects),t.length)return t;for(t=[],n=function(){var t,n,i,r;for(i=this.objects,r=[],t=0,n=i.length;n>t;t++)s=i[t],r.push(s.compileToFragments(e,A));return r}.call(this),r=o=0,a=n.length;a>o;r=++o)i=n[r],r&&t.push(this.makeCode(", ")),t.push.apply(t,i);return wt(t).indexOf("\n")>=0?(t.unshift(this.makeCode("[\n"+e.indent)),t.push(this.makeCode("\n"+this.tab+"]"))):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.objects,n=0,i=r.length;i>n;n++)if(t=r[n],t.assigns(e))return!0;return!1},t}(s),e.Class=c=function(e){function n(e,t,i){this.variable=e,this.parent=t,this.body=null!=i?i:new o,n.__super__.constructor.call(this),this.boundFuncs=[],this.body.classBody=!0}return Rt(n,e),n.prototype.children=["variable","parent","body"],n.prototype.determineName=function(){var e,n;return this.variable?(e=(n=yt(this.variable.properties))?n instanceof t&&n.name.value:this.variable.base.value,It.call(K,e)>=0&&this.variable.error("class variable name may not be "+e),e&&(e=v.test(e)&&e)):null},n.prototype.setContext=function(e){return this.body.traverseChildren(!1,function(t){return t.classBody?!1:t instanceof O&&"this"===t.value?t.value=e:t instanceof h&&(t.klass=e,t.bound)?t.context=e:void 0})},n.prototype.addBoundFunctions=function(e){var n,i,r,s,o;for(o=this.boundFuncs,r=0,s=o.length;s>r;r++)n=o[r],i=new at(new O("this"),[new t(n)]).compile(e),this.ctor.body.unshift(new O(""+i+" = "+Dt("bind")+"("+i+", this)"))},n.prototype.addProperties=function(e,n,r){var s,o,a,c,u;return u=e.base.properties.slice(0),a=function(){var e;for(e=[];s=u.shift();)s instanceof i&&(o=s.variable.base,delete s.context,c=s.value,"constructor"===o.value?(this.ctor&&s.error("cannot define more than one constructor in a class"),c.bound&&s.error("cannot define a constructor as a bound function"),c instanceof h?s=this.ctor=c:(this.externalCtor=r.classScope.freeVariable("class"),s=new i(new O(this.externalCtor),c))):s.variable["this"]?c["static"]=!0:(s.variable=new at(new O(n),[new t(new O("prototype")),new t(o)]),c instanceof h&&c.bound&&(this.boundFuncs.push(o),c.bound=!1))),e.push(s);return e}.call(this),lt(a)},n.prototype.walkBody=function(e,t){return this.traverseChildren(!1,function(r){return function(s){var a,c,u,h,l,p,d;if(a=!0,s instanceof n)return!1;if(s instanceof o){for(d=c=s.expressions,u=l=0,p=d.length;p>l;u=++l)h=d[u],h instanceof i&&h.variable.looksStatic(e)?h.value["static"]=!0:h instanceof at&&h.isObject(!0)&&(a=!1,c[u]=r.addProperties(h,e,t));s.expressions=c=mt(c)}return a&&!(s instanceof n)}}(this))},n.prototype.hoistDirectivePrologue=function(){var e,t,n;for(t=0,e=this.body.expressions;(n=e[t])&&n instanceof p||n instanceof at&&n.isString();)++t;return this.directives=e.splice(0,t)},n.prototype.ensureConstructor=function(e){return this.ctor||(this.ctor=new h,this.externalCtor?this.ctor.body.push(new O(""+this.externalCtor+".apply(this, arguments)")):this.parent&&this.ctor.body.push(new O(""+e+".__super__.constructor.apply(this, arguments)")),this.ctor.body.makeReturn(),this.body.expressions.unshift(this.ctor)),this.ctor.ctor=this.ctor.name=e,this.ctor.klass=null,this.ctor.noReturn=!0},n.prototype.compileNode=function(e){var t,n,r,s,c,u,l,p,d;return(s=this.body.jumps())&&s.error("Class bodies cannot contain pure statements"),(n=this.body.contains(bt))&&n.error("Class bodies shouldn't reference arguments"),l=this.determineName()||"_Class",l.reserved&&(l="_"+l),u=new O(l),r=new h([],o.wrap([this.body])),t=[],e.classScope=r.makeScope(e.scope),this.hoistDirectivePrologue(),this.setContext(l),this.walkBody(l,e),this.ensureConstructor(l),this.addBoundFunctions(e),this.body.spaced=!0,this.body.expressions.push(u),this.parent&&(p=new O(e.classScope.freeVariable("super",!1)),this.body.expressions.unshift(new w(u,p)),r.params.push(new W(p)),t.push(this.parent)),(d=this.body.expressions).unshift.apply(d,this.directives),c=new q(new a(r,t)),this.variable&&(c=new i(this.variable,c)),c.compileToFragments(e)},n}(s),e.Assign=i=function(e){function n(e,t,i,r){var s,o,a;this.variable=e,this.value=t,this.context=i,n.__super__.constructor.call(this),this.param=r&&r.param,this.subpattern=r&&r.subpattern,a=o=this.variable.unwrapAll().value,s=It.call(K,a)>=0,s&&"object"!==this.context&&this.variable.error('variable name may not be "'+o+'"'),this.icedlocal=r&&r.icedlocal}return Rt(n,e),n.prototype.children=["variable","value"],n.prototype.isStatement=function(e){return(null!=e?e.level:void 0)===$&&null!=this.context&&It.call(this.context,"?")>=0},n.prototype.assigns=function(e){return this["object"===this.context?"value":"variable"].assigns(e)},n.prototype.unfoldSoak=function(e){return xt(e,this,"variable")},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,u,l;if(this.value.icedStatementAssertion(),i=this.variable instanceof at){if(this.variable.isArray()||this.variable.isObject())return this.compilePatternMatch(e);if(this.variable.isSplice())return this.compileSplice(e);if("||="===(c=this.context)||"&&="===c||"?="===c)return this.compileConditional(e)}return n=this.variable.compileToFragments(e,A),s=wt(n),this.context||(a=this.variable.unwrapAll(),a.isAssignable()||this.variable.error('"'+this.variable.compile(e)+'" cannot be assigned'),("function"==typeof a.hasProperties?a.hasProperties():void 0)||(this.param||this.icedlocal?e.scope.add(s,"var",this.icedlocal):e.scope.find(s))),this.value instanceof h&&(r=j.exec(s))&&(r[2]&&(this.value.klass=r[1]),this.value.name=null!=(u=null!=(l=r[3])?l:r[4])?u:r[5]),o=this.value.compileToFragments(e,A),"object"===this.context?n.concat(this.makeCode(": "),o):(t=n.concat(this.makeCode(" "+(this.context||"=")+" "),o),A>=e.level?t:this.wrapInBraces(t))},n.prototype.compilePatternMatch=function(e){var i,r,s,o,a,c,u,h,l,p,d,f,m,w,g,b,y,k,_,C,F,T,L,N,D,E,S,I;if(b=e.level===$,k=this.value,d=this.variable.base.objects,!(f=d.length))return s=k.compileToFragments(e),e.level>=R?this.wrapInBraces(s):s;if(u=this.variable.isObject(),b&&1===f&&!((p=d[0])instanceof et))return p instanceof n?(L=p,N=L.variable,c=N.base,p=L.value):c=u?p["this"]?p.properties[0].name:p:new O(0),i=v.test(c.unwrap().value||0),k=new at(k),k.properties.push(new(i?t:x)(c)),D=p.unwrap().value,It.call(G,D)>=0&&p.error("assignment to a reserved word: "+p.compile(e)),new n(p,k,null,{param:this.param}).compileToFragments(e,$);for(_=k.compileToFragments(e,A),C=wt(_),r=[],g=!1,(!v.test(C)||this.variable.assigns(C))&&(r.push([this.makeCode(""+(m=e.scope.freeVariable("ref"))+" = ")].concat($t.call(_))),_=[this.makeCode(m)],C=m),a=F=0,T=d.length;T>F;a=++F)p=d[a],c=a,u&&(p instanceof n?(E=p,S=E.variable,c=S.base,p=E.value):p.base instanceof q?(I=new at(p.unwrapAll()).cacheReference(e),p=I[0],c=I[1]):c=p["this"]?p.properties[0].name:p),!g&&p instanceof et?(l=p.name.unwrap().value,p=p.unwrap(),y=""+f+" <= "+C+".length ? "+Dt("slice")+".call("+C+", "+a,(w=f-a-1)?(h=e.scope.freeVariable("i"),y+=", "+h+" = "+C+".length - "+w+") : ("+h+" = "+a+", [])"):y+=") : []",y=new O(y),g=""+h+"++"):(l=p.unwrap().value,p instanceof et&&p.error("multiple splats are disallowed in an assignment"),"number"==typeof c?(c=new O(g||c),i=!1):i=u&&v.test(c.unwrap().value||0),y=new at(new O(C),[new(i?t:x)(c)])),null!=l&&It.call(G,l)>=0&&p.error("assignment to a reserved word: "+p.compile(e)),r.push(new n(p,y,null,{param:this.param,subpattern:!0}).compileToFragments(e,A));return b||this.subpattern||r.push(_),o=this.joinFragmentArrays(r,", "),A>e.level?o:this.wrapInBraces(o)},n.prototype.compileConditional=function(e){var t,i,r,s;return s=this.variable.cacheReference(e),i=s[0],r=s[1],!i.properties.length&&i.base instanceof O&&"this"!==i.base.value&&!e.scope.check(i.base.value)&&this.variable.error('the variable "'+i.base.value+"\" can't be assigned with "+this.context+" because it has not been declared before"),It.call(this.context,"?")>=0?(e.isExistentialEquals=!0,new L(new m(i),r,{type:"if"}).addElse(new n(r,this.value,"=")).compileToFragments(e)):(t=new U(this.context.slice(0,-1),i,new n(r,this.value,"=")).compileToFragments(e),A>=e.level?t:this.wrapInBraces(t))},n.prototype.compileSplice=function(e){var t,n,i,r,s,o,a,c,u,h,l,p;return h=this.variable.properties.pop().range,i=h.from,a=h.to,n=h.exclusive,o=this.variable.compile(e),i?(l=this.cacheToCodeFragments(i.cache(e,R)),r=l[0],s=l[1]):r=s="0",a?i instanceof at&&i.isSimpleNumber()&&a instanceof at&&a.isSimpleNumber()?(a=a.compile(e)-s,n||(a+=1)):(a=a.compile(e,E)+" - "+s,n||(a+=" + 1")):a="9e9",p=this.value.cache(e,A),c=p[0],u=p[1],t=[].concat(this.makeCode("[].splice.apply("+o+", ["+r+", "+a+"].concat("),c,this.makeCode(")), "),u),e.level>$?this.wrapInBraces(t):t},n}(s),e.Code=h=function(e){function r(e,t,n){r.__super__.constructor.call(this),this.params=e||[],this.body=t||new o,this.icedgen="icedgen"===n,this.icedPassedDeferral=null,this.bound="boundfunc"===n||this.icedgen}return Rt(r,e),r.prototype.children=["params","body"],r.prototype.isStatement=function(){return!!this.ctor},r.prototype.jumps=B,r.prototype.makeScope=function(e){return new J(e,this.body,this)},r.prototype.compileNode=function(e){var t,s,c,u,h,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,N,x,D,S,A,R,I,$,j,P,B,V,M;if(this.bound&&(null!=($=e.scope.method)?$.bound:void 0)&&(this.context=e.scope.method.context),this.bound&&!this.context)return this.context="_this",y=new r([new W(new O(this.context))],new o([this])),s=new a(y,[new O("this")]),s.updateLocationDataIfMissing(this.locationData),s.compileNode(e);for(e.scope=pt(e,"classScope")||this.makeScope(e.scope),e.scope.shared=pt(e,"sharedScope")||this.icedgen,e.scope.icedgen=this.icedgen,e.indent+=nt,delete e.bare,delete e.isExistentialEquals,f=[],u=[],j=this.params,k=0,T=j.length;T>k;k++)d=j[k],e.scope.parameter(d.asReference(e));for(P=this.params,_=0,N=P.length;N>_;_++)if(d=P[_],d.splat){for(B=this.params,C=0,x=B.length;x>C;C++)p=B[C].name,p["this"]&&(p=p.properties[0].name),p.value&&e.scope.add(p.value,"var",!0);w=new i(new at(new n(function(){var t,n,i,r;for(i=this.params,r=[],t=0,n=i.length;n>t;t++)p=i[t],r.push(p.asReference(e));return r}.call(this))),new at(new O("arguments")));break}for(V=this.params,F=0,D=V.length;D>F;F++)d=V[F],d.isComplex()?(b=m=d.asReference(e),d.value&&(b=new U("?",m,d.value)),u.push(new i(new at(d.name),b,"=",{param:!0}))):(m=d,d.value&&(l=new O(m.name.value+" == null"),b=new i(new at(d.name),d.value,"="),u.push(new L(l,b)))),w||f.push(m);for(v=this.body.isEmpty(),w&&u.unshift(w),u.length&&(M=this.body.expressions).unshift.apply(M,u),h=R=0,S=f.length;S>R;h=++R)p=f[h],f[h]=p.compileToFragments(e),e.scope.parameter(wt(f[h]));for(g=[],this.eachParamName(function(e,t){return It.call(g,e)>=0&&t.error("multiple parameters named '"+e+"'"),g.push(e)}),this.icedHasAutocbFlag&&(v=!1),v||this.noReturn||this.body.makeReturn(),c="function",this.ctor&&(c+=" "+this.name),c+="(",t=[this.makeCode(c)],h=I=0,A=f.length;A>I;h=++I)p=f[h],h&&t.push(this.makeCode(", ")),t.push.apply(t,p);return t.push(this.makeCode(") {")),this.icedPatchBody(e),this.body.isEmpty()||(t=t.concat(this.makeCode("\n"),this.body.compileWithDeclarations(e),this.makeCode("\n"+this.tab))),t.push(this.makeCode("}")),this.ctor?[this.makeCode(this.tab)].concat($t.call(t)):this.front||e.level>=E?this.wrapInBraces(t):t},r.prototype.eachParamName=function(e){var t,n,i,r,s;for(r=this.params,s=[],n=0,i=r.length;i>n;n++)t=r[n],s.push(t.eachName(e));return s},r.prototype.traverseChildren=function(e,t){return e?r.__super__.traverseChildren.call(this,e,t):void 0},r.prototype.icedPatchBody=function(e){var n,r,s,o;return this.icedFoundArguments&&this.icedNodeFlag&&e.scope.assign("_arguments","arguments"),this.icedNodeFlag&&!this.icedgen&&(this.icedPassedDeferral=e.scope.freeVariable(gt["const"].passed_deferral),r=new at(new O(this.icedPassedDeferral)),n=new at(new O(gt["const"].ns)),n.add(new t(new at(new O(gt["const"].findDeferral)))),o=new a(n,[new at(new O("arguments"))]),this.body.unshift(new i(r,o))),this.icedNodeFlag&&!this.icedgen?(s=this.icedHasAutocbFlag?gt["const"].autocb:gt["const"].k_noop,o=new at(new O(s)),r=new at(new O(gt["const"].k)),this.body.unshift(new i(r,o,null,{icedlocal:!0}))):void 0},r.prototype.icedWalkAst=function(e,t){var n,i,s,o,a,c,u,h;for(this.icedParentAwait=e,i=t.foundAutocb,n=t.currFunc,o=t.foundArguments,s=t.foundAwaitFunc,t.foundAutocb=!1,t.foundArguments=!1,t.foundAwaitFunc=!1,t.currFunc=this,h=this.params,c=0,u=h.length;u>c;c++)if(a=h[c],a.name instanceof O&&a.name.value===gt["const"].autocb){t.foundAutocb=!0;break}return this.icedHasAutocbFlag=t.foundAutocb,r.__super__.icedWalkAst.call(this,e,t),this.icedFoundArguments=t.foundArguments,t.foundAwaitFunc=s,t.foundArguments=o,t.foundAutocb=i,t.currFunc=n,!1},r.prototype.icedWalkAstLoops=function(){return r.__super__.icedWalkAstLoops.call(this,!1)&&(this.icedLoopFlag=!0),!1},r.prototype.icedWalkCpsPivots=function(){return r.__super__.icedWalkCpsPivots.call(this),this.icedCpsPivotFlag=!1},r.prototype.icedTraceName=function(){var e;return e=[],this.klass&&e.push(this.klass),this.name&&e.push(this.name),e.join(".")},r}(s),e.Param=W=function(e){function t(e,n,i){var r;this.name=e,this.value=n,this.splat=i,t.__super__.constructor.call(this),r=e=this.name.unwrapAll().value,It.call(K,r)>=0&&this.name.error('parameter name "'+e+'" is not allowed')}return Rt(t,e),t.prototype.children=["name","value"],t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e,A)},t.prototype.asReference=function(e){var t;return this.reference?this.reference:(t=this.name,t["this"]?(t=t.properties[0].name,t.value.reserved&&(t=new O(e.scope.freeVariable(t.value)))):t.isComplex()&&(t=new O(e.scope.freeVariable("arg"))),t=new at(t),this.splat&&(t=new et(t)),t.updateLocationDataIfMissing(this.locationData),this.reference=t)},t.prototype.isComplex=function(){return this.name.isComplex()},t.prototype.eachName=function(e,t){var n,r,s,o,a,c;if(null==t&&(t=this.name),n=function(t){var n;return n=t.properties[0].name,n.value.reserved?void 0:e(n.value,n)},t instanceof O)return e(t.value,t);if(t instanceof at)return n(t);for(c=t.objects,o=0,a=c.length;a>o;o++)s=c[o],s instanceof i?this.eachName(e,s.value.unwrap()):s instanceof et?(r=s.name.unwrap(),e(r.value,r)):s instanceof at?s.isArray()||s.isObject()?this.eachName(e,s.base):s["this"]?n(s):e(s.base.value,s.base):s.error("illegal parameter "+s.compile())},t}(s),e.Splat=et=function(e){function t(e){t.__super__.constructor.call(this),this.name=e.compile?e:new O(e)}return Rt(t,e),t.prototype.children=["name"],t.prototype.isAssignable=ut,t.prototype.assigns=function(e){return this.name.assigns(e)},t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e)},t.prototype.unwrap=function(){return this.name},t.compileSplattedArray=function(e,n,i){var r,s,o,a,c,u,h,l,p,d;for(h=-1;(l=n[++h])&&!(l instanceof t););if(h>=n.length)return[];if(1===n.length)return l=n[0],c=l.compileToFragments(e,A),i?c:[].concat(l.makeCode(""+Dt("slice")+".call("),c,l.makeCode(")"));for(r=n.slice(h),u=p=0,d=r.length;d>p;u=++p)l=r[u],o=l.compileToFragments(e,A),r[u]=l instanceof t?[].concat(l.makeCode(""+Dt("slice")+".call("),o,l.makeCode(")")):[].concat(l.makeCode("["),o,l.makeCode("]"));return 0===h?(l=n[0],a=l.joinFragmentArrays(r.slice(1),", "),r[0].concat(l.makeCode(".concat("),a,l.makeCode(")"))):(s=function(){var t,i,r,s;for(r=n.slice(0,h),s=[],t=0,i=r.length;i>t;t++)l=r[t],s.push(l.compileToFragments(e,A));return s}(),s=n[0].joinFragmentArrays(s,", "),a=n[h].joinFragmentArrays(r,", "),[].concat(n[0].makeCode("["),s,n[h].makeCode("].concat("),a,yt(n).makeCode(")")))},t.prototype.icedToSlot=function(e){return new Z(e,new at(this.name),null,!0)},t}(s),e.While=ct=function(e){function r(e,t){this.condition=(null!=t?t.invert:void 0)?e.invert():e,this.guard=null!=t?t.guard:void 0}return Rt(r,e),r.prototype.children=["condition","guard","body"],r.prototype.isStatement=ut,r.prototype.isLoop=ut,r.prototype.makeReturn=function(e){return e?r.__super__.makeReturn.apply(this,arguments):(this.returns=!this.jumps({loop:!0}),this)},r.prototype.addBody=function(e){return this.body=e,this},r.prototype.jumps=function(){var e,t,n,i,r;if(e=this.body.expressions,!e.length)return!1;for(i=0,r=e.length;r>i;i++)if(n=e[i],t=n.jumps({loop:!0}))return t;return!1},r.prototype.compileNode=function(e){var t,n,i,r;return this.condition.icedStatementAssertion(),this.icedNodeFlag?this.icedCompileIced(e):(e.indent+=nt,r="",n=this.body,n.isEmpty()?n=this.makeCode(""):(this.returns&&(n.makeReturn(i=e.scope.freeVariable("results")),r=""+this.tab+i+" = [];\n"),this.guard&&(n.expressions.length>1?n.expressions.unshift(new L(new q(this.guard).invert(),new O("continue"))):this.guard&&(n=o.wrap([new L(this.guard,n)]))),n=[].concat(this.makeCode("\n"),n.compileToFragments(e,$),this.makeCode("\n"+this.tab))),t=[].concat(this.makeCode(r+this.tab+"while ("),this.condition.compileToFragments(e,I),this.makeCode(") {"),n,this.makeCode("}")),this.returns&&(this.icedHasAutocbFlag?(t.push(this.makeCode("\n"+this.tab+gt["const"].autocb+"("+i+");")),t.push(this.makeCode("\n"+this.tab+"return;"))):t.push(this.makeCode("\n"+this.tab+"return "+i+";"))),t)},r.prototype.icedWrap=function(e){var r,s,c,u,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,N,x,D,E,S,A,R,I,$,j,P,B,V,M,H,U,q,G;return w=e.condition,r=e.body,I=e.rvar,R=[],I&&(j=new at(new O(I))),U=new at(new O(gt["const"].t_while)),T=new at(new O(gt["const"].k)),N=new W(new O(gt["const"].k)),p=new at(new O(gt["const"].b_while)),I?(l=new a(T,[j]),c=new o([l]),u=new h([],c,"icedgen"),s=new i(p,u,null,{icedlocal:!0})):s=new i(p,T,null,{icedlocal:!0}),_=new at(new O(gt["const"].c_while)),v=new o([new a(U,[T])]),e.step&&v.unshift(e.step),k=new h([],v),G=new at(new O(gt["const"].ns)),G.add(new t(new at(new O(gt["const"].trampoline)))),b=new o([new a(G,[k])]),y=new h([],b,"icedgen"),g=new i(_,y,null,{icedlocal:!0}),A=new at(new O(gt["const"].n_while)),I?(x=new W(new O(gt["const"].n_arg)),C=j.copy(),C.add(new t(new at(new O("push")))),d=new a(C,[x]),f=new a(_,[]),E=new o([d,f]),S=new h([x],E,"icedgen"),D=new i(A,S,null,{icedlocal:!0})):D=new i(A,_),m=new L(w.invert(),new o([new a(p,[])])),e.guard?(b=new o([new a(_,[])]),F=new L(e.guard,r),F.addElse(b),m.addElse(new o([e.pre_body,F]))):m.addElse(new o([e.pre_body,r])),V=new o([s,g,D,m]),H=new h([N],V,"icedgen"),P=new i(U,H,null,{icedlocal:!0}),M=new a(U,[T]),q=[],e.init&&(q=q.concat(e.init)),I&&($=new i(j,new n),q.push($)),q=q.concat([P,M]),B=new o(q)},r.prototype.icedCallContinuation=function(){return this.body.icedThreadReturn(new T(gt["const"].n_while))},r.prototype.icedCompileIced=function(e){var t,n;return n={condition:this.condition,body:this.body,guard:this.guard},this.returns&&(n.rvar=e.scope.freeVariable("results")),t=this.icedWrap(n),t.compileNode(e)},r}(s),e.Op=U=function(e){function t(e,i,r,s){if(t.__super__.constructor.call(this),"in"===e)return new N(i,r);if("do"===e)return this.generateDo(i);if("new"===e){if(i instanceof a&&!i["do"]&&!i.isNew)return i.newInstance();(i instanceof h&&i.bound||i["do"])&&(i=new q(i))}return this.operator=n[e]||e,this.first=i,this.second=r,this.flip=!!s,this}var n,r;return Rt(t,e),n={"==":"===","!=":"!==",of:"in"},r={"!==":"===","===":"!=="},t.prototype.children=["first","second"],t.prototype.isSimpleNumber=B,t.prototype.isUnary=function(){return!this.second},t.prototype.isComplex=function(){var e;return!(this.isUnary()&&("+"===(e=this.operator)||"-"===e))||this.first.isComplex()},t.prototype.isChainable=function(){var e;return"<"===(e=this.operator)||">"===e||">="===e||"<="===e||"==="===e||"!=="===e},t.prototype.invert=function(){var e,n,i,s,o;if(this.isChainable()&&this.first.isChainable()){for(e=!0,n=this;n&&n.operator;)e&&(e=n.operator in r),n=n.first;if(!e)return new q(this).invert();for(n=this;n&&n.operator;)n.invert=!n.invert,n.operator=r[n.operator],n=n.first;return this}return(s=r[this.operator])?(this.operator=s,this.first.unwrap()instanceof t&&this.first.invert(),this):this.second?new q(this).invert():"!"===this.operator&&(i=this.first.unwrap())instanceof t&&("!"===(o=i.operator)||"in"===o||"instanceof"===o)?i:new t("!",this)},t.prototype.unfoldSoak=function(e){var t;return("++"===(t=this.operator)||"--"===t||"delete"===t)&&xt(e,this,"first")},t.prototype.generateDo=function(e){var t,n,r,s,o,c,u,l;for(s=[],n=e instanceof i&&(o=e.value.unwrap())instanceof h?o:e,l=n.params||[],c=0,u=l.length;u>c;c++)r=l[c],r.value?(s.push(r.value),delete r.value):s.push(r);return t=new a(e,s),t["do"]=!0,t},t.prototype.compileNode=function(e){var t,n,i,r;return n=this.isChainable()&&this.first.isChainable(),n||(this.first.front=this.front),"delete"===this.operator&&e.scope.check(this.first.unwrapAll().value)&&this.error("delete operand may not be argument or var"),("--"===(i=this.operator)||"++"===i)&&(r=this.first.unwrapAll().value,It.call(K,r)>=0)&&this.error('cannot increment/decrement "'+this.first.unwrapAll().value+'"'),this.isUnary()?this.compileUnary(e):n?this.compileChain(e):"?"===this.operator?this.compileExistence(e):(t=[].concat(this.first.compileToFragments(e,R),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,R)),R>=e.level?t:this.wrapInBraces(t))},t.prototype.compileChain=function(e){var t,n,i,r;return r=this.first.second.cache(e),this.first.second=r[0],i=r[1],n=this.first.compileToFragments(e,R),t=n.concat(this.makeCode(" "+(this.invert?"&&":"||")+" "),i.compileToFragments(e),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,R)),this.wrapInBraces(t)},t.prototype.compileExistence=function(e){var t,n;return this.first.isComplex()?(n=new O(e.scope.freeVariable("ref")),t=new q(new i(n,this.first))):(t=this.first,n=t),new L(new m(t),n,{type:"if"}).addElse(this.second).compileToFragments(e)},t.prototype.compileUnary=function(e){var n,i,r;return i=[],n=this.operator,i.push([this.makeCode(n)]),"!"===n&&this.first instanceof m?(this.first.negated=!this.first.negated,this.first.compileToFragments(e)):e.level>=E?new q(this).compileToFragments(e):(r="+"===n||"-"===n,("new"===n||"typeof"===n||"delete"===n||r&&this.first instanceof t&&this.first.operator===n)&&i.push([this.makeCode(" ")]),(r&&this.first instanceof t||"new"===n&&this.first.isStatement(e))&&(this.first=new q(this.first)),i.push(this.first.compileToFragments(e,R)),this.flip&&i.reverse(),this.joinFragmentArrays(i,""))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+" "+this.operator)},t.prototype.icedWrapContinuation=function(){return this.icedCallContinuationFlag},t}(s),e.In=N=function(e){function t(e,n){this.object=e,this.array=n,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["object","array"],t.prototype.invert=P,t.prototype.compileNode=function(e){var t,n,i,r,s;if(this.array instanceof at&&this.array.isArray()){for(s=this.array.base.objects,i=0,r=s.length;r>i;i++)if(n=s[i],n instanceof et){t=!0;break}if(!t)return this.compileOrTest(e)}return this.compileLoopTest(e)},t.prototype.compileOrTest=function(e){var t,n,i,r,s,o,a,c,u,h,l,p;if(0===this.array.base.objects.length)return[this.makeCode(""+!!this.negated)];for(h=this.object.cache(e,R),o=h[0],s=h[1],l=this.negated?[" !== "," && "]:[" === "," || "],t=l[0],n=l[1],a=[],p=this.array.base.objects,i=c=0,u=p.length;u>c;i=++c)r=p[i],i&&a.push(this.makeCode(n)),a=a.concat(i?s:o,this.makeCode(t),r.compileToFragments(e,E));return R>e.level?a:this.wrapInBraces(a)},t.prototype.compileLoopTest=function(e){var t,n,i,r;return r=this.object.cache(e,A),i=r[0],n=r[1],t=[].concat(this.makeCode(Dt("indexOf")+".call("),this.array.compileToFragments(e,A),this.makeCode(", "),n,this.makeCode(") "+(this.negated?"< 0":">= 0"))),wt(i)===wt(n)?t:(t=i.concat(this.makeCode(", "),t),A>e.level?t:this.wrapInBraces(t))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+(this.negated?"!":""))},t}(s),e.Slot=Z=function(e){function t(e,n,i,r){t.__super__.constructor.call(this),this.index=e,this.value=n,this.suffix=i,this.splat=r,this.access=null}return Rt(t,e),t.prototype.addAccess=function(e){return this.access=e,this},t.prototype.children=["value","suffix"],t}(s),e.Defer=f=function(e){function n(e,t){var i,r;this.lineno=t,n.__super__.constructor.call(this),this.slots=mt(function(){var t,n,s;for(s=[],r=t=0,n=e.length;n>t;r=++t)i=e[r],s.push(i.icedToSlot(r));return s}()),this.params=[],this.vars=[],this.custom=!1}return Rt(n,e),n.prototype.children=["slots"],n.prototype.setCustom=function(){return this.custom=!0,this},n.prototype.newParam=function(){var e;return e=""+gt["const"].slot+"_"+(this.params.length+1),this.params.push(new W(new O(e))),new at(new O(e))},n.prototype.makeAssignFn=function(e){var n,r,s,c,u,l,p,d,f,m,w,g,b,v,y,k,_,C,F;if(0===this.slots.length)return null;for(c=[],r=[],d=0,F=this.slots,_=0,C=F.length;C>_;_++)y=F[_],d=y.index,n=new at(new O("arguments")),f=new at(new O(d)),y.splat?(p=new at(new O(Dt("slice"))),p.add(new t(new at(new O("call")))),l=new a(p,[n,f]),k=y.value,this.vars.push(k),s=new i(k,l)):(n.add(new x(f)),y.access&&n.add(y.access),y.suffix?(r.push(y.value),k=this.newParam(),y.suffix instanceof x?(v=new x(this.newParam()),r.push(y.suffix.index)):v=y.suffix,k.add(v)):(w=y.value.compile(e,$),"_"===w?(k=new at(new O(gt["const"].deferrals)),k.add(new t(new at(new O(gt["const"].retslot))))):(k=y.value,this.vars.push(k))),s=new i(k,n)),c.push(s);return u=new o(c),m=new h([],u,"icedgen"),g=new o([new Y(m)]),b=new h(this.params,g,"icedgen"),l=new a(b,r)},n.prototype.transform=function(e){var n,r,s,o,c,u,h,l,p,d;return d=new at(new O(gt["const"].defer_method)),this.custom?u=d:(u=new at(new O(gt["const"].deferrals)),u.add(new t(d))),r=[],(n=this.makeAssignFn(e))&&r.push(new i(new at(new O(gt["const"].assign_fn)),n,"object")),l=new at(new O(gt["const"].lineno)),p=new at(new O(this.lineno)),h=new i(l,p,"object"),r.push(h),this.custom&&(o=new at(new O(gt["const"].context)),c=new at(new O(gt["const"].deferrals)),s=new i(o,c,"object"),r.push(s)),e=new H(r),new a(u,[new at(e)])},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a;for(t=this.transform(e),a=this.vars,s=0,o=a.length;o>s;s++)r=a[s],n=r.compile(e,A),i=e.scope,i.add(n,"var");return t.compileNode(e)},n.prototype.icedWalkAst=function(e,t){return this.icedHasAutocbFlag=t.foundAutocb,t.foundDefer=!0,this.parentFunc=t.currFunc,n.__super__.icedWalkAst.call(this,e,t)},n}(s),e.Await=r=function(e){function n(e){this.body=e,n.__super__.constructor.call(this)}return Rt(n,e),n.prototype.transform=function(e){var n,r,s,o,c,u,h,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T;return s=this.body,k=gt["const"].deferrals,e.scope.add(k,"var"),b=new at(new O(k)),l=new at(new O(gt["const"].ns)),l.add(new t(new at(new O(gt["const"].Deferrals)))),r=[],(y=null!=(F=this.parentFunc)?F.icedPassedDeferral:void 0)&&(u=new at(new O(gt["const"].parent)),h=new at(new O(y)),c=new i(u,h,"object"),r.push(c)),null!=e.filename&&(d=new at(new O(gt["const"].filename)),f=new at(new O('"'+e.filename.replace(/\\/g,"\\\\")+'"')),p=new i(d,f,"object"),r.push(p)),(y=null!=(T=this.parentFunc)?T.icedTraceName():void 0)&&(w=new at(new O(gt["const"].funcname)),g=new at(new O('"'+y+'"')),m=new i(w,g,"object"),r.push(m)),C=new H(r,!0),o=new a(l,[new at(new O(gt["const"].k)),C]),_=new U("new",o),n=new i(b,_),s.unshift(n),v=b.copy().add(new t(new at(new O(gt["const"].fulfill)))),o=new a(v,[]),s.push(o),this.body=s
},n.prototype.children=["body"],n.prototype.isStatement=function(){return ut},n.prototype.makeReturn=it,n.prototype.compileNode=function(e){return this.transform(e),this.body.compileNode(e)},n.prototype.icedWalkAst=function(e,t){return this.icedHasAutocbFlag=t.foundAutocb,this.parentFunc=t.currFunc,e=e||this,this.icedParentAwait=e,n.__super__.icedWalkAst.call(this,e,t),this.icedNodeFlag=t.foundAwaitFunc=t.foundAwait=!0},n}(s),F=function(e){function n(e,t){this.foundDefer=e,this.foundAwait=t,n.__super__.constructor.call(this)}return Rt(n,e),n.prototype.compileNode=function(e){var r,s,c,u,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,L,N,x,E;if(this.expressions=[],k=e.runtime?e.runtime:e.bare?"none":this.foundDefer?"node":"none",!e.runtime||this.foundDefer||e.runforce||(k="none"),C=!1,F=null,d=null,d=function(){switch(k){case"inline":case"window":return"window"===k&&(C=!0),C&&(F=new at(new O(k))),D.generate(F?F.copy():null);case"node":case"browserify":return"browserify"===k?(g="iced-coffee-script/lib/coffee-script/iced",s=gt["const"].runtime):(g="iced-coffee-script",s=gt["const"].ns),p=new O("'"+g+"'"),r=new t(new O(s)),v=new at(new O("require")),u=new a(v,[p]),l=new at(u),l.add(r),b=new at(new O(gt["const"].ns)),new i(b,l);case"none":return null;default:throw SyntaxError("unexpected flag IcedRuntime "+k)}}(),d&&this.push(d),this.foundAwait){for(y=new h([],new o([])),w=[],E=[gt["const"].k_noop,gt["const"].k],T=0,N=E.length;N>T;T++)f=E[T],_=new at(new O(f)),F&&(m=F.copy(),m.add(new t(_)),_=m),w.push(_);for(c=y,L=0,x=w.length;x>L;L++)k=w[L],c=new i(k,c);this.push(c)}return this.isEmpty()?[]:n.__super__.compileNode.call(this,e)},n.prototype.icedWalkAst=function(e,t){return this.icedHasAutocbFlag=t.foundAutocb,n.__super__.icedWalkAst.call(this,e,t)},n}(o),e.Try=st=function(e){function t(e,t,n,i){this.attempt=e,this.errorVariable=t,this.recovery=n,this.ensure=i}return Rt(t,e),t.prototype.children=["attempt","recovery","ensure"],t.prototype.isStatement=ut,t.prototype.jumps=function(e){var t;return this.attempt.jumps(e)||(null!=(t=this.recovery)?t.jumps(e):void 0)},t.prototype.makeReturn=function(e){return this.attempt&&(this.attempt=this.attempt.makeReturn(e)),this.recovery&&(this.recovery=this.recovery.makeReturn(e)),this},t.prototype.compileNode=function(e){var t,n,r,s;return e.indent+=nt,s=this.attempt.compileToFragments(e,$),t=this.recovery?(r=new O("_error"),this.errorVariable?this.recovery.unshift(new i(this.errorVariable,r)):void 0,[].concat(this.makeCode(" catch ("),r.compileToFragments(e),this.makeCode(") {\n"),this.recovery.compileToFragments(e,$),this.makeCode("\n"+this.tab+"}"))):this.ensure||this.recovery?[]:[this.makeCode(" catch (_error) {}")],n=this.ensure?[].concat(this.makeCode(" finally {\n"),this.ensure.compileToFragments(e,$),this.makeCode("\n"+this.tab+"}")):[],[].concat(this.makeCode(""+this.tab+"try {\n"),s,this.makeCode("\n"+this.tab+"}"),t,n)},t}(s),e.Throw=rt=function(e){function t(e){this.expression=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=ut,t.prototype.jumps=B,t.prototype.makeReturn=it,t.prototype.compileNode=function(e){return[].concat(this.makeCode(this.tab+"throw "),this.expression.compileToFragments(e),this.makeCode(";"))},t}(s),e.Existence=m=function(e){function t(e){this.expression=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["expression"],t.prototype.invert=P,t.prototype.compileNode=function(e){var t,n,i,r;return this.expression.front=this.front,i=this.expression.compile(e,R),v.test(i)&&!e.scope.check(i)?(r=this.negated?["===","||"]:["!==","&&"],t=r[0],n=r[1],i="typeof "+i+" "+t+' "undefined" '+n+" "+i+" "+t+" null"):i=""+i+" "+(this.negated?"==":"!=")+" null",[this.makeCode(S>=e.level?i:"("+i+")")]},t}(s),e.Parens=q=function(e){function t(e){this.body=e,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["body"],t.prototype.unwrap=function(){return this.body},t.prototype.isComplex=function(){return this.body.isComplex()},t.prototype.compileNode=function(e){var t,n,i;return n=this.body.unwrap(),n instanceof at&&n.isAtomic()?(n.front=this.front,n.compileToFragments(e)):(i=n.compileToFragments(e,I),t=R>e.level&&(n instanceof U||n instanceof a||n instanceof g&&n.returns),t?i:this.wrapInBraces(i))},t}(s),e.For=g=function(e){function r(e,t){var n;r.__super__.constructor.call(this),this.source=t.source,this.guard=t.guard,this.step=t.step,this.name=t.name,this.index=t.index,this.body=o.wrap([e]),this.own=!!t.own,this.object=!!t.object,this.object&&(n=[this.index,this.name],this.name=n[0],this.index=n[1]),this.index instanceof at&&this.index.error("index cannot be a pattern matching expression"),this.range=this.source instanceof at&&this.source.base instanceof X&&!this.source.properties.length,this.pattern=this.name instanceof at,this.range&&this.index&&this.index.error("indexes do not apply to range loops"),this.range&&this.pattern&&this.name.error("cannot pattern match over range loops"),this.own&&!this.object&&this.name.error("cannot use own with for-in"),this.returns=!1}return Rt(r,e),r.prototype.children=["body","source","guard","step"],r.prototype.compileNode=function(e){var t,n,r,s,a,c,u,h,l,p,d,f,m,w,g,b,y,k,_,C,F,T,N,x,D,E,S,R,I,j,P,B,V,H;return t=o.wrap([this.body]),k=null!=(V=yt(t.expressions))?V.jumps():void 0,k&&k instanceof Y&&(this.returns=!1),S=this.range?this.source.base:this.source,E=e.scope,C=this.name&&this.name.compile(e,A),w=this.index&&this.index.compile(e,A),C&&!this.pattern&&E.find(C),w&&E.find(w),this.returns&&(D=E.freeVariable("results")),g=this.object&&w||E.freeVariable("i"),b=this.range&&C||w||g,y=b!==g?""+b+" = ":"",this.step&&!this.range&&(H=this.cacheToCodeFragments(this.step.cache(e,A)),R=H[0],j=H[1],I=j.match(M)),this.pattern&&(C=g),B="",d="",u="",f=this.tab+nt,S.icedStatementAssertion(),this.icedNodeFlag?this.icedCompileIced(e,{stepVar:j,body:t,rvar:D,kvar:b,guard:this.guard}):(this.range?p=S.compileToFragments(_t(e,{index:g,name:C,step:this.step})):(P=this.source.compile(e,A),!C&&!this.own||v.test(P)||(u+=""+this.tab+(T=E.freeVariable("ref"))+" = "+P+";\n",P=T),C&&!this.pattern&&(F=""+C+" = "+P+"["+b+"]"),this.object||(R!==j&&(u+=""+this.tab+R+";\n"),this.step&&I&&(l=0>Ft(I[0]))||(_=E.freeVariable("len")),a=""+y+g+" = 0, "+_+" = "+P+".length",c=""+y+g+" = "+P+".length - 1",r=""+g+" < "+_,s=""+g+" >= 0",this.step?(I?l&&(r=s,a=c):(r=""+j+" > 0 ? "+r+" : "+s,a="("+j+" > 0 ? ("+a+") : "+c+")"),m=""+g+" += "+j):m=""+(b!==g?"++"+g:""+g+"++"),p=[this.makeCode(""+a+"; "+r+"; "+y+m)])),this.returns&&(N=""+this.tab+D+" = [];\n",x=this.icedHasAutocbFlag?"\n"+this.tab+gt["const"].autocb+"("+D+"); return;":"\n"+this.tab+"return "+D+";",t.makeReturn(D)),this.guard&&(t.expressions.length>1?t.expressions.unshift(new L(new q(this.guard).invert(),new O("continue"))):this.guard&&(t=o.wrap([new L(this.guard,t)]))),this.pattern&&t.expressions.unshift(new i(this.name,new O(""+P+"["+b+"]"))),h=[].concat(this.makeCode(u),this.pluckDirectCall(e,t)),F&&(B="\n"+f+F+";"),this.object&&(p=[this.makeCode(""+b+" in "+P)],this.own&&(d="\n"+f+"if (!"+Dt("hasProp")+".call("+P+", "+b+")) continue;")),n=t.compileToFragments(_t(e,{indent:f}),$),n&&n.length>0&&(n=[].concat(this.makeCode("\n"),n,this.makeCode("\n"))),[].concat(h,this.makeCode(""+(N||"")+this.tab+"for ("),p,this.makeCode(") {"+d+B),n,this.makeCode(""+this.tab+"}"+(x||""))))},r.prototype.pluckDirectCall=function(e,t){var n,r,s,o,c,u,l,p,d,f,m,w,g,b,v,y;for(r=[],f=t.expressions,c=p=0,d=f.length;d>p;c=++p)s=f[c],s=s.unwrapAll(),s instanceof a&&(l=null!=(m=s.variable)?m.unwrapAll():void 0,(l instanceof h||l instanceof at&&(null!=(w=l.base)?w.unwrapAll():void 0)instanceof h&&1===l.properties.length&&("call"===(g=null!=(b=l.properties[0].name)?b.value:void 0)||"apply"===g))&&(o=(null!=(v=l.base)?v.unwrapAll():void 0)||l,u=new O(e.scope.freeVariable("fn")),n=new at(u),l.base&&(y=[n,l],l.base=y[0],n=y[1]),t.expressions[c]=new a(n,s.args),r=r.concat(this.makeCode(this.tab),new i(u,o).compileToFragments(e,$),this.makeCode(";\n"))));return r},r.prototype.icedCompileIced=function(e,s){var a,c,u,h,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,N,D,E,S,A,R,I,$,j,P,B,V,M,H,W,G,X,Y,z,K,J,Q,Z;return f=s.body,m=null,k=[],Q=null,K=e.scope,W=new o([]),this.object?(G=K.freeVariable("ref"),X=new at(new O(G)),a=new i(X,this.source),N=K.freeVariable("keys"),S=new at(new O(N)),C=K.freeVariable("k"),F=new O(C),T=new at(F),w=new at(new n),j=new o([T]),B={object:!0,name:F,source:X},P=new r(j,B),c=new i(S,P),y=K.freeVariable("i"),_=new at(new O(y)),u=new i(_,new at(new O(0))),k=[a,c,u],E=S.copy(),E.add(new t(new at(new O("length")))),m=new U("<",_,E),Q=new U("++",_),this.name&&(J=X.copy(),J.add(new x(this.index)),l=new i(this.name,J),W.unshift(l)),D=S.copy(),D.add(new x(_)),h=new i(this.index,D),W.unshift(h)):this.range&&this.name?(d=new at(new O("_begin")),g=new at(new O("_end")),H=new at(new O("_positive")),Z=this.step||new O(1),Q=new L(H,new U("+=",this.name,Z)),Q.addElse(new U("-=",this.name,Z)),b=this.source.base.exclusive?"=":"",M=new U("&&",new U("===",H,new O(!0)),new U(">"+b,this.name,this.source.base.to)),V=new U("&&",new U("===",H,new O(!1)),new U("<"+b,this.name,this.source.base.to)),m=new U("||",new q(M),new q(V)),m=m.invert(),k=[new i(this.name,this.source.base.from),new i(d,this.source.base.from),new i(g,this.source.base.to),new i(H,new U(">",g,d))]):!this.range&&this.name&&(A=new at(new O(s.kvar)),R=K.freeVariable("len"),G=K.freeVariable("ref"),X=new at(new O(G)),$=new at(new O(R)),a=new i(X,this.source),I=X.copy().add(new t(new at(new O("length")))),c=new i($,I),u=new i(A,new at(new O(0))),k=[a,c,u],m=new U("<",A,$),Q=new U("++",A),Y=X.copy(),Y.add(new x(A)),h=new i(this.name,Y),W.unshift(h)),z=s.rvar,v=s.guard,p=this.icedWrap({condition:m,body:f,init:k,step:Q,rvar:z,guard:v,pre_body:W}),p.compileNode(e)},r}(ct),e.Switch=tt=function(e){function t(e,n,i){this.subject=e,this.cases=n,this.otherwise=i,t.__super__.constructor.call(this)}return Rt(t,e),t.prototype.children=["subject","cases","otherwise"],t.prototype.isStatement=ut,t.prototype.jumps=function(e){var t,n,i,r,s,o,a,c;for(null==e&&(e={block:!0}),o=this.cases,r=0,s=o.length;s>r;r++)if(a=o[r],n=a[0],t=a[1],i=t.jumps(e))return i;return null!=(c=this.otherwise)?c.jumps(e):void 0},t.prototype.makeReturn=function(e){var t,n,i,r,s;for(r=this.cases,n=0,i=r.length;i>n;n++)t=r[n],t[1].makeReturn(e);return e&&(this.otherwise||(this.otherwise=new o([new O("void 0")]))),null!=(s=this.otherwise)&&s.makeReturn(e),this},t.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,u,h,l,p,d,f,m,w;for(this.subject&&this.subject.icedStatementAssertion(),c=e.indent+nt,u=e.indent=c+nt,o=[].concat(this.makeCode(this.tab+"switch ("),this.subject?this.subject.compileToFragments(e,I):this.makeCode("false"),this.makeCode(") {\n")),f=this.cases,a=h=0,p=f.length;p>h;a=++h){for(m=f[a],r=m[0],t=m[1],w=mt([r]),l=0,d=w.length;d>l;l++)i=w[l],this.subject||(i=i.invert()),o=o.concat(this.makeCode(c+"case "),i.compileToFragments(e,I),this.makeCode(":\n"));if((n=t.compileToFragments(e,$)).length>0&&(o=o.concat(n,this.makeCode("\n"))),a===this.cases.length-1&&!this.otherwise)break;s=this.lastNonComment(t.expressions),s instanceof Y||s instanceof O&&s.jumps()&&"debugger"!==s.value||o.push(i.makeCode(u+"break;\n"))}return this.otherwise&&this.otherwise.expressions.length&&o.push.apply(o,[this.makeCode(c+"default:\n")].concat($t.call(this.otherwise.compileToFragments(e,$)),[this.makeCode("\n")])),o.push(this.makeCode(this.tab+"}")),o},t.prototype.icedCallContinuation=function(){var e,t,n,i,r,s;for(r=this.cases,n=0,i=r.length;i>n;n++)s=r[n],t=s[0],e=s[1],e.icedThreadReturn();return null!=this.otherwise?this.otherwise.icedThreadReturn():this.otherwise=new o([new T])},t}(s),e.If=L=function(e){function t(e,n,i){this.body=n,null==i&&(i={}),t.__super__.constructor.call(this),this.condition="unless"===i.type?e.invert():e,this.elseBody=null,this.isChain=!1,this.soak=i.soak}return Rt(t,e),t.prototype.children=["condition","body","elseBody"],t.prototype.bodyNode=function(){var e;return null!=(e=this.body)?e.unwrap():void 0},t.prototype.elseBodyNode=function(){var e;return null!=(e=this.elseBody)?e.unwrap():void 0},t.prototype.addElse=function(e){return this.isChain?this.elseBodyNode().addElse(e):(this.isChain=e instanceof t,this.elseBody=this.ensureBlock(e),this.elseBody.updateLocationDataIfMissing(e.locationData)),this},t.prototype.isStatement=function(e){var t;return(null!=e?e.level:void 0)===$||this.bodyNode().isStatement(e)||(null!=(t=this.elseBodyNode())?t.isStatement(e):void 0)},t.prototype.jumps=function(e){var t;return this.body.jumps(e)||(null!=(t=this.elseBody)?t.jumps(e):void 0)},t.prototype.compileNode=function(e){return this.condition.icedStatementAssertion(),this.isStatement(e||this.icedIsCpsPivot())?this.compileStatement(e):this.compileExpression(e)},t.prototype.makeReturn=function(e){return e&&(this.elseBody||(this.elseBody=new o([new O("void 0")]))),this.body&&(this.body=new o([this.body.makeReturn(e)])),this.elseBody&&(this.elseBody=new o([this.elseBody.makeReturn(e)])),this},t.prototype.ensureBlock=function(e){return e instanceof o?e:new o([e])},t.prototype.compileStatement=function(e){var n,i,r,s,o,a,c;return r=pt(e,"chainChild"),(o=pt(e,"isExistentialEquals"))?new t(this.condition.invert(),this.elseBodyNode(),{type:"if"}).compileToFragments(e):(c=e.indent+nt,s=this.condition.compileToFragments(e,I),i=this.ensureBlock(this.body).compileToFragments(_t(e,{indent:c})),a=[].concat(this.makeCode("if ("),s,this.makeCode(") {\n"),i,this.makeCode("\n"+this.tab+"}")),r||a.unshift(this.makeCode(this.tab)),this.elseBody?(n=a.concat(this.makeCode(" else ")),this.isChain?(e.chainChild=!0,n=n.concat(this.elseBody.unwrap().compileToFragments(e,$))):n=n.concat(this.makeCode("{\n"),this.elseBody.compileToFragments(_t(e,{indent:c}),$),this.makeCode("\n"+this.tab+"}")),n):a)},t.prototype.compileExpression=function(e){var t,n,i,r;return i=this.condition.compileToFragments(e,S),n=this.bodyNode().compileToFragments(e,A),t=this.elseBodyNode()?this.elseBodyNode().compileToFragments(e,A):[this.makeCode("void 0")],r=i.concat(this.makeCode(" ? "),n,this.makeCode(" : "),t),e.level>=S?this.wrapInBraces(r):r},t.prototype.unfoldSoak=function(){return this.soak&&this},t.prototype.icedCallContinuation=function(){return this.elseBody?(this.elseBody.icedThreadReturn(),this.isChain=!1):this.addElse(new T),this.body.icedThreadReturn()},t}(s),u={wrap:function(e,n,i){var r,s,c,u,l;return e.jumps()?e:(u=new h([],o.wrap([e])),r=[],s=e.contains(this.isLiteralArguments),s&&e.classBody&&s.error("Class bodies shouldn't reference arguments"),(s||e.contains(this.isLiteralThis))&&(l=new O(s?"apply":"call"),r=[new O("this")],s&&r.push(new O("arguments")),u=new at(u,[new t(l)])),u.noReturn=i,c=new a(u,r),n?o.wrap([c]):c)},isLiteralArguments:function(e){return e instanceof O&&"arguments"===e.value&&!e.asKey},isLiteralThis:function(e){return e instanceof O&&"this"===e.value&&!e.asKey||e instanceof h&&e.bound||e instanceof a&&e.isSuper}},xt=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new at(t),i},d={wrap:function(e,t,n,i){var r,s,c,u,l,p;return p=new h([new W(new O(gt["const"].k))],o.wrap([e]),"icedgen"),r=[],n&&(n.bindName(i),r.push(n)),s=o.wrap([t]),u=(l=s.icedGetSingle())&&l instanceof T&&l.canInline()?l.extractFunc():new h(r,s,"icedgen"),c=new a(p,[u]),new o([c])}},T=function(e){function t(e,n){this.func=e,null==n&&(n=null),t.__super__.constructor.call(this),this.func||(this.func=gt["const"].k),this.value=n}return Rt(t,e),t.prototype.children=["value"],t.prototype.assignValue=function(e){return this.value=e},t.prototype.canInline=function(){return!this.value||this.value instanceof C},t.prototype.literalFunc=function(){return new O(this.func)},t.prototype.extractFunc=function(){return new at(this.literalFunc())},t.prototype.compileNode=function(e){var t,n,i;return n=this.literalFunc(),i=e.level===$?this.value?new o([this.value,new a(n)]):new a(n):(t=this.value?[this.value]:[],new a(n,t)),i.compileNode(e)},t}(s),C=function(e){function t(){t.__super__.constructor.call(this,null,null,!1)}return Rt(t,e),t.counter=0,t.prototype.bindName=function(e){var n;return n=""+e.scope.freeVariable(gt["const"].param,!1)+"_"+t.counter++,this.name=new O(n)},t.prototype.compile=function(e){return this.name||this.bindName(e),t.__super__.compile.call(this,e)},t}(W),D={generate:function(e){var n,r,s,u,l,p,d,f,m,w,g,b,v,y,k,_,C,F,T,N,x,D,E,S,A,R,I,$,j,P,B,M,q,G,X,Y,z,K,J,Q,Z,et,tt,nt,it,rt,st,ot,ct,ut,ht,lt,pt,dt,ft,mt,wt,bt,vt,yt;return Y=new O("continuation"),m=new O("count"),f=new at(new O(gt["const"].Deferrals)),tt=new at(new O(gt["const"].ns)),e&&(e.add(new t(tt)),tt=e),z=new at(new O("this")),z.add(new t(Y)),ot=new W(z),w=new at(new O("this")),w.add(new t(m)),ct=new at(new O("this")),ct.add(new t(new at(new O(gt["const"].retslot)))),n=new i(w,new at(new O(1))),r=new i(ct,V()),k=[ot],b=new o([n,r]),v=new h(k,b),y=new at(new O("constructor")),g=new i(y,v),P=new a(z,[ct]),$=new o([P]),_=new U("--",w),j=new U("!",_),Z=new L(j,$),mt=new o([Z]),bt=new h([],mt),yt=new at(new O(gt["const"].fulfill)),ft=new i(yt,bt),B=new U("++",w),X=new O("inner_params"),D=new O("defer_params"),E=new at(D),d=new at(D),s=new O(gt["const"].assign_fn),d.add(new t(s,"soak")),Q=new O("apply"),d.add(new t(Q,"soak")),et=V(),u=new a(d,[et,new at(X)]),vt=new at(new O("this")),vt.add(new t(new O(gt["const"].fulfill))),wt=new a(vt,[]),M=new o([u,wt]),G=[new W(X,null,!0)],q=new h(G,M,"boundfunc"),F=new o([B,q]),x=[new W(D)],T=new h(x,F),N=new at(new O(gt["const"].defer_method)),C=new i(N,T),l=[g,ft,C],rt=new H(l,!0),p=new o([new at(rt)]),K=new c(null,null,p),J=new i(f,K,"object"),st=new o([V()]),R=new h([],st),I=new at(new O(gt["const"].findDeferral)),A=new i(I,R,"object"),S=new O("_fn"),ht=new o([new a(new at(S),[])]),dt=[new W(S)],lt=new h(dt,ht),pt=new at(new O(gt["const"].trampoline)),ut=new i(pt,lt,"object"),nt=new H([J,A,ut],!0),it=new at(nt),new i(tt,it)}},ot={"extends":function(){return"function(child, parent) { for (var key in parent) { if ("+Dt("hasProp")+".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},bind:function(){return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"},indexOf:function(){return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"},hasProp:function(){return"{}.hasOwnProperty"},slice:function(){return"[].slice"}},$=1,I=2,A=3,S=4,R=5,E=6,nt="  ",y="[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",v=RegExp("^"+y+"$"),z=/^[+-]?\d+$/,b=/^[+-]?0x[\da-f]+/i,M=/^[+-]?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)$/i,j=RegExp("^("+y+")(\\.prototype)?(?:\\.("+y+")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\])$"),_=/^['"]/,k=/^\//,Dt=function(e){var t;return t="__"+e,J.root.assign(t,ot[e]()),t},Ct=function(e,t){return e=e.replace(/\n/g,"$&"+t),e.replace(/\s+$/,"")},Ft=function(e){return null==e?0:e.match(b)?parseInt(e,16):parseFloat(e)},bt=function(e){return e instanceof O&&"arguments"===e.value&&!e.asKey},vt=function(e){return e instanceof O&&"this"===e.value&&!e.asKey||e instanceof h&&e.bound||e instanceof a&&e.isSuper},xt=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new at(t),i}}.call(this),t.exports}(),require["./sourcemap"]=function(){var e={},t={exports:e};return function(){var t,n;t=function(){function e(e){this.line=e,this.columns=[]}return e.prototype.add=function(e,t,n){var i,r;return r=t[0],i=t[1],null==n&&(n={}),this.columns[e]&&n.noReplace?void 0:this.columns[e]={line:this.line,column:e,sourceLine:r,sourceColumn:i}},e.prototype.sourceLocation=function(e){for(var t;!((t=this.columns[e])||0>=e);)e--;return t&&[t.sourceLine,t.sourceColumn]},e}(),n=function(){function e(){this.lines=[]}var n,i,r,s;return e.prototype.add=function(e,n,i){var r,s,o,a;return null==i&&(i={}),s=n[0],r=n[1],o=(a=this.lines)[s]||(a[s]=new t(s)),o.add(r,e,i)},e.prototype.sourceLocation=function(e){var t,n,i;for(n=e[0],t=e[1];!((i=this.lines[n])||0>=n);)n--;return i&&i.sourceLocation(t)},e.prototype.generate=function(e,t){var n,i,r,s,o,a,c,u,h,l,p,d,f,m,w,g;for(null==e&&(e={}),null==t&&(t=null),l=0,i=0,s=0,r=0,u=!1,n="",w=this.lines,a=p=0,f=w.length;f>p;a=++p)if(o=w[a])for(g=o.columns,d=0,m=g.length;m>d;d++)if(c=g[d]){for(;c.line>l;)i=0,u=!1,n+=";",l++;u&&(n+=",",u=!1),n+=this.encodeVlq(c.column-i),i=c.column,n+=this.encodeVlq(0),n+=this.encodeVlq(c.sourceLine-s),s=c.sourceLine,n+=this.encodeVlq(c.sourceColumn-r),r=c.sourceColumn,u=!0}return h={version:3,file:e.generatedFile||"",sourceRoot:e.sourceRoot||"",sources:e.sourceFiles||[""],names:[],mappings:n},e.inline&&(h.sourcesContent=[t]),JSON.stringify(h,null,2)},r=5,i=1<<r,s=i-1,e.prototype.encodeVlq=function(e){var t,n,o,a;for(t="",o=0>e?1:0,a=(Math.abs(e)<<1)+o;a||!t;)n=a&s,a>>=r,a&&(n|=i),t+=this.encodeBase64(n);return t},n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e.prototype.encodeBase64=function(e){return n[e]||function(){throw Error("Cannot Base64 encode value: "+e)}()},e}(),e.SourceMap=n}.call(this),t.exports}(),require["./coffee-script"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,u,h,l,p,d,f,m={}.hasOwnProperty,w=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};s=require("fs"),d=require("vm"),l=require("path"),t=require("./lexer").Lexer,h=require("./parser").parser,a=require("./helpers"),n=require("./sourcemap").SourceMap,c=require("./iced"),e.VERSION="1.6.3-j",e.FILE_EXTENSIONS=[".coffee",".litcoffee",".coffee.md",".iced"],e.helpers=a,f=function(e){return function(t,n){var i;null==n&&(n={});try{return e.call(this,t,n)}catch(r){throw i=r,a.updateSyntaxError(i,t,n.filename)}}},e.compile=i=f(function(e,t){var i,r,s,o,l,p,d,f,m,w,g,b,v;for(w=a.merge,o=a.extend,t=o({},t),t.sourceMap&&(m=new n),p=c.transform(h.parse(u.tokenize(e,t)),t).compileToFragments(t),s=0,t.header&&(s+=1),t.shiftLine&&(s+=1),r=0,f="",b=0,v=p.length;v>b;b++)l=p[b],t.sourceMap&&(l.locationData&&m.add([l.locationData.first_line,l.locationData.first_column],[s,r],{noReplace:!0}),g=a.count(l.code,"\n"),s+=g,g?r=l.code.length-(l.code.lastIndexOf("\n")+1):r+=l.code.length),f+=l.code;return t.header&&(d="Generated by IcedCoffeeScript "+this.VERSION,f="// "+d+"\n"+f),t.sourceMap?(i={js:f},i.sourceMap=m,i.v3SourceMap=m.generate(t,e),i):f}),e.tokens=f(function(e,t){return u.tokenize(e,t)}),e.nodes=f(function(e,t){return"string"==typeof e?c.transform(h.parse(u.tokenize(e,t)),t):c.transform(h.parse(e),t)}),e.run=function(e,t){var n,r,o,c;return null==t&&(t={}),o=require.main,o.filename=process.argv[1]=t.filename?s.realpathSync(t.filename):".",o.moduleCache&&(o.moduleCache={}),r=t.fileName?l.dirname(s.realpathSync(t.filename)):s.realpathSync("."),o.paths=require("module")._nodeModulePaths(r),(!a.isCoffee(o.filename)||require.extensions)&&(n=i(e,t),e=null!=(c=n.js)?c:n),o._compile(e,o.filename)},e.eval=function(e,t){var n,r,s,o,a,c,u,h,p,f,w,g,b,v;if(null==t&&(t={}),e=e.trim()){if(r=d.Script){if(null!=t.sandbox){if(t.sandbox instanceof r.createContext().constructor)u=t.sandbox;else{u=r.createContext(),g=t.sandbox;for(o in g)m.call(g,o)&&(h=g[o],u[o]=h)}u.global=u.root=u.GLOBAL=u}else u=global;if(u.__filename=t.filename||"eval",u.__dirname=l.dirname(u.__filename),u===global&&!u.module&&!u.require){for(n=require("module"),u.module=w=new n(t.modulename||"eval"),u.require=v=function(e){return n._load(e,w,!0)},w.filename=u.__filename,b=Object.getOwnPropertyNames(require),p=0,f=b.length;f>p;p++)c=b[p],"paths"!==c&&(v[c]=require[c]);v.paths=w.paths=n._nodeModulePaths(process.cwd()),v.resolve=function(e){return n._resolveFilename(e,w)}}}a={};for(o in t)m.call(t,o)&&(h=t[o],a[o]=h);return a.bare=!0,s=i(e,a),u===global?d.runInThisContext(s):d.runInContext(s,u)}},e.register=function(){return require("./register")},e._compileFile=function(e,t){var n,r,o,c;null==t&&(t=!1),o=s.readFileSync(e,"utf8"),c=65279===o.charCodeAt(0)?o.substring(1):o;try{n=i(c,{filename:e,sourceMap:t,literate:a.isLiterate(e)})}catch(u){throw r=u,a.updateSyntaxError(r,c,e)}return n},u=new t,h.lexer={lex:function(){var e,t;return t=this.tokens[this.pos++],t?(e=t[0],this.yytext=t[1],this.yylloc=t[2],this.yylineno=this.yylloc.first_line):e="",e},setInput:function(e){return this.tokens=e,this.pos=0},upcomingInput:function(){return""}},h.yy=require("./nodes"),e.iced=c.runtime,h.yy.parseError=function(e,t){var n;return n=t.token,e="unexpected "+(1===n?"end of input":n),a.throwSyntaxError(e,h.lexer.yylloc)},r=function(e,t){var n,i,r,s,o,a,c,u,h,l,p,d;return s=void 0,r="",e.isNative()?r="native":(e.isEval()?(s=e.getScriptNameOrSourceURL(),s||(r=""+e.getEvalOrigin()+", ")):s=e.getFileName(),s||(s="<anonymous>"),u=e.getLineNumber(),i=e.getColumnNumber(),l=t(s,u,i),r=l?""+s+":"+l[0]+":"+l[1]:""+s+":"+u+":"+i),o=e.getFunctionName(),a=e.isConstructor(),c=!(e.isToplevel()||a),c?(h=e.getMethodName(),d=e.getTypeName(),o?(p=n="",d&&o.indexOf(d)&&(p=""+d+"."),h&&o.indexOf("."+h)!==o.length-h.length-1&&(n=" [as "+h+"]"),""+p+o+n+" ("+r+")"):""+d+"."+(h||"<anonymous>")+" ("+r+")"):a?"new "+(o||"<anonymous>")+" ("+r+")":o?""+o+" ("+r+")":r},p={},o=function(t){var n,i;if(p[t])return p[t];if(i=null!=l?l.extname(t):void 0,!(0>w.call(e.FILE_EXTENSIONS,i)))return n=e._compileFile(t,!0),p[t]=n.sourceMap},Error.prepareStackTrace=function(t,n){var i,s,a,c;return a=function(e,t,n){var i,r;return r=o(e),r&&(i=r.sourceLocation([t-1,n-1])),i?[i[0]+1,i[1]+1]:null},s=function(){var t,s,o;for(o=[],t=0,s=n.length;s>t&&(i=n[t],i.getFunction()!==e.run);t++)o.push("  at "+r(i,a));return o}(),""+t.name+": "+(null!=(c=t.message)?c:"")+"\n"+s.join("\n")+"\n"}}.call(this),t.exports}(),require["./browser"]=function(){var exports={},module={exports:exports};return function(){var CoffeeScript,compile,compileCount,runScripts,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};CoffeeScript=require("./coffee-script"),CoffeeScript.require=require,CoffeeScript.code={},compile=CoffeeScript.compile,compileCount=0,CoffeeScript.eval=function(code,options){return null==options&&(options={}),null==options.bare&&(options.bare=!0),eval(compile(code,options))},CoffeeScript.run=function(e,t){return null==t&&(t={}),t.bare=!0,t.shiftLine=!0,Function(compile(e,t))()},"undefined"!=typeof window&&null!==window&&("undefined"!=typeof btoa&&null!==btoa&&"undefined"!=typeof JSON&&null!==JSON&&"undefined"!=typeof unescape&&null!==unescape&&"undefined"!=typeof encodeURIComponent&&null!==encodeURIComponent&&(compile=function(e,t){var n,i,r,s;return null==t&&(t={}),t.sourceMap=!0,t.inline=!0,s=CoffeeScript.compile(e,t),n=s.js,r=s.v3SourceMap,i="coffeescript"+compileCount++,CoffeeScript.code[i]={coffee:e,map:r,js:n},""+n+"\n//# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(r)))+"\n//# sourceURL="+i}),CoffeeScript.load=function(e,t,n,i){var r;return null==n&&(n={}),null==i&&(i=!1),n.sourceFiles=[e],r=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest,r.open("GET",e,!0),"overrideMimeType"in r&&r.overrideMimeType("text/plain"),r.onreadystatechange=function(){var s,o;if(4===r.readyState){if(0!==(o=r.status)&&200!==o)throw Error("Could not load "+e);if(s=[r.responseText,n],i||CoffeeScript.run.apply(CoffeeScript,s),t)return t(s)}},r.send(null)},runScripts=function(){var e,t,n,i,r,s,o,a,c,u,h;for(a=window.document.getElementsByTagName("script"),t=["text/coffeescript","text/literate-coffeescript"],e=function(){var e,n,i,r;for(r=[],e=0,n=a.length;n>e;e++)s=a[e],i=s.type,__indexOf.call(t,i)>=0&&r.push(s);return r}(),r=0,n=function(){var t;return t=e[r],t instanceof Array?(CoffeeScript.run.apply(CoffeeScript,t),r++,n()):void 0},c=function(i,r){var s;return s={literate:i.type===t[1]},i.src?CoffeeScript.load(i.src,function(t){return e[r]=t,n()},s,!0):(s.sourceFiles=["embedded"],e[r]=[i.innerHTML,s])},i=u=0,h=e.length;h>u;i=++u)o=e[i],c(o,i);return n()},window.addEventListener?window.addEventListener("DOMContentLoaded",runScripts,!1):window.attachEvent("onload",runScripts))}.call(this),module.exports}(),require["./icedlib"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,u=[].slice;r=s=function(){},i=require("./iced"),e.iced=n=i.runtime,c=function(e,t,i,r){var o,a,c,h,l,p;p=s,h=n.findDeferral(arguments),a=new n.Rendezvous,r[0]=a.id(!0).defer({assign_fn:function(){return function(){return function(){return o=u.call(arguments,0)}}}(this)(),lineno:17,context:l}),setTimeout(a.id(!1).defer({lineno:18,context:l}),t),function(){return function(e){l=new n.Deferrals(e,{parent:h,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee"}),a.wait(l.defer({assign_fn:function(){return function(){return c=arguments[0]}}(),lineno:19})),l._fulfill()}}(this)(function(){return function(){return i&&(i[0]=c),e.apply(null,o)}}(this))},e.timeout=function(e,t,n){var i;return i=[],c(e,t,n,i),i[0]},o=function(e,t,i){var r,o,a,c;c=s,o=n.findDeferral(arguments),function(){return function(e){a=new n.Deferrals(e,{parent:o,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee"}),i[0]=a.defer({assign_fn:function(){return function(){return r=arguments[0]}}(),lineno:34}),a._fulfill()}}(this)(function(){return function(){return r||(t[0]=!1),e()}}(this))},e.iand=function(e,t){var n;return n=[],o(e,t,n),n[0]},a=function(e,t,i){var r,o,a,c;c=s,o=n.findDeferral(arguments),function(){return function(e){a=new n.Deferrals(e,{parent:o,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee"}),i[0]=a.defer({assign_fn:function(){return function(){return r=arguments[0]}}(),lineno:51}),a._fulfill()}}(this)(function(){return function(){return r&&(t[0]=!0),e()}}(this))},e.ior=function(e,t){var n;return n=[],a(e,t,n),n[0]},e.Pipeliner=t=function(){function e(e,t){this.window=e||1,this.delay=t||0,this.queue=[],this.n_out=0,this.cb=null,this[i["const"].deferrals]=this,this.defer=this._defer}return e.prototype.waitInQueue=function(e){var t,i,r;r=s,t=n.findDeferral(arguments),function(e){return function(r){var s,o;s=[],o=function(r){var a,c,u;return a=function(){return r(s)},c=function(){return n.trampoline(function(){return o(r)})},u=function(e){return s.push(e),c()},e.n_out>=e.window?(function(r){i=new n.Deferrals(r,{parent:t,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee",funcname:"Pipeliner.waitInQueue"}),e.cb=i.defer({lineno:88}),i._fulfill()}(u),void 0):a()},o(r)}}(this)(function(r){return function(){r.n_out++,function(e){return r.delay?(function(e){i=new n.Deferrals(e,{parent:t,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee",funcname:"Pipeliner.waitInQueue"}),setTimeout(i.defer({lineno:96}),r.delay),i._fulfill()}(e),void 0):e()}(function(){return e()})}}(this))},e.prototype.__defer=function(e,t){var i,r,o,a,c;c=s,o=n.findDeferral(arguments),function(){return function(i){a=new n.Deferrals(i,{parent:o,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee",funcname:"Pipeliner.__defer"}),r=a.defer({lineno:109}),e[0]=function(){var e,n;return e=arguments.length>=1?u.call(arguments,0):[],null!=(n=t.assign_fn)&&n.apply(null,e),r()},a._fulfill()}}(this)(function(e){return function(){return e.n_out--,e.cb?(i=e.cb,e.cb=null,i()):void 0}}(this))},e.prototype._defer=function(e){var t;return t=[],this.__defer(t,e),t[0]},e.prototype.flush=function(e){var t,i,r,s;i=e,t=n.findDeferral(arguments),r=[],s=function(e){var i;return function(o){var a,c,u;return a=function(){return o(r)},c=function(){return n.trampoline(function(){return s(o)})},u=function(e){return r.push(e),c()},e.n_out?(function(r){i=new n.Deferrals(r,{parent:t,filename:"/home/davidbau/git/pencil-coffee-script/src/icedlib.coffee",funcname:"Pipeliner.flush"}),e.cb=i.defer({lineno:136}),i._fulfill()
}(u),void 0):a()}}(this),s(i)},e}()}.call(this),t.exports}(),require["./coffee-script"]}();"function"==typeof define&&define.amd?(define(function(){return CoffeeScript}),define(function(){return CoffeeScript.iced})):(root.CoffeeScript=CoffeeScript,root.iced=CoffeeScript.iced)})(this);;/*!
 * jQuery JavaScript Library v1.11.0-beta3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-12-20T22:44Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this, window may not be defined yet
}(this, function( window ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var trim = "".trim;

var support = {};



var
	version = "1.11.0-beta3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return a 'clean' array
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return just the object
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return obj - parseFloat( obj ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: trim && !trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.15
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-12-20
 */
(function( window ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select t=''><option selected=''></option></select>";

			// Support: IE8, Opera 10-12
			// Nothing should be selected when empty strings follow ^= or $= or *=
			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !(--remaining) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	}
});

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};


var strundefined = typeof undefined;



// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

jQuery(function() {
	// We need to execute this one support test ASAP because we need to know
	// if body.style.zoom needs to be set.

	var container, div,
		body = document.getElementsByTagName("body")[0];

	if ( !body ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

	div = document.createElement( "div" );
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1";

		if ( (support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 )) ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );

	// Null elements to avoid leaks in IE
	container = div = null;
});




(function() {
	var div = document.createElement( "div" );

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute("classid") === noData;
};


var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,
		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};



// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[0], key ) : emptyGet;
};
var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		input = document.createElement("input");

	input.type = "checkbox";

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	fragment = div = input = null;
})();


(function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined && (
				// Support: IE < 9
				src.returnValue === false ||
				// Support: Android < 4.0
				src.getPreventDefault && src.getPreventDefault() ) ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!support.noCloneEvent || !support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = (rtagName.exec( elem ) || [ "", "" ])[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ (rtagName.exec( value ) || [ "", "" ])[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			window.getDefaultComputedStyle( elem[ 0 ] ).display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}


(function() {
	var a, shrinkWrapBlocksVal,
		div = document.createElement( "div" ),
		divReset =
			"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;" +
			"display:block;padding:0;margin:0;border:0";

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	a.style.cssText = "float:left;opacity:.5";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Null elements to avoid leaks in IE.
	a = div = null;

	support.shrinkWrapBlocks = function() {
		var body, container, div, containerStyles;

		if ( shrinkWrapBlocksVal == null ) {
			body = document.getElementsByTagName( "body" )[ 0 ];
			if ( !body ) {
				// Test fired too early or in an unsupported environment, exit.
				return;
			}

			containerStyles = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px";
			container = document.createElement( "div" );
			div = document.createElement( "div" );

			body.appendChild( container ).appendChild( div );

			// Will be changed later if needed.
			shrinkWrapBlocksVal = false;

			if ( typeof div.style.zoom !== strundefined ) {
				// Support: IE6
				// Check if elements with layout shrink-wrap their children
				div.style.cssText = divReset + ";width:1px;padding:1px;zoom:1";
				div.innerHTML = "<div></div>";
				div.firstChild.style.width = "5px";
				shrinkWrapBlocksVal = div.offsetWidth !== 3;
			}

			body.removeChild( container );

			// Null elements to avoid leaks in IE.
			body = container = div = null;
		}

		return shrinkWrapBlocksVal;
	};

})();
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );



var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var a, reliableHiddenOffsetsVal, boxSizingVal, boxSizingReliableVal,
		pixelPositionVal, reliableMarginRightVal,
		div = document.createElement( "div" ),
		containerStyles = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
		divReset =
			"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;" +
			"display:block;padding:0;margin:0;border:0";

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	a.style.cssText = "float:left;opacity:.5";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Null elements to avoid leaks in IE.
	a = div = null;

	jQuery.extend(support, {
		reliableHiddenOffsets: function() {
			if ( reliableHiddenOffsetsVal != null ) {
				return reliableHiddenOffsetsVal;
			}

			var container, tds, isSupported,
				div = document.createElement( "div" ),
				body = document.getElementsByTagName( "body" )[ 0 ];

			if ( !body ) {
				// Return for frameset docs that don't have a body
				return;
			}

			// Setup
			div.setAttribute( "className", "t" );
			div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

			container = document.createElement( "div" );
			container.style.cssText = containerStyles;

			body.appendChild( container ).appendChild( div );

			// Support: IE8
			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName( "td" );
			tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
			isSupported = ( tds[ 0 ].offsetHeight === 0 );

			tds[ 0 ].style.display = "";
			tds[ 1 ].style.display = "none";

			// Support: IE8
			// Check if empty table cells still have offsetWidth/Height
			reliableHiddenOffsetsVal = isSupported && ( tds[ 0 ].offsetHeight === 0 );

			body.removeChild( container );

			// Null elements to avoid leaks in IE.
			div = body = null;

			return reliableHiddenOffsetsVal;
		},

		boxSizing: function() {
			if ( boxSizingVal == null ) {
				computeStyleTests();
			}
			return boxSizingVal;
		},

		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {
			var body, container, div, marginDiv;

			// Use window.getComputedStyle because jsdom on node.js will break without it.
			if ( reliableMarginRightVal == null && window.getComputedStyle ) {
				body = document.getElementsByTagName( "body" )[ 0 ];
				if ( !body ) {
					// Test fired too early or in an unsupported environment, exit.
					return;
				}

				container = document.createElement( "div" );
				div = document.createElement( "div" );
				container.style.cssText = containerStyles;

				body.appendChild( container ).appendChild( div );

				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// Fails in WebKit before Feb 2011 nightlies
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				marginDiv = div.appendChild( document.createElement( "div" ) );
				marginDiv.style.cssText = div.style.cssText = divReset;
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";

				reliableMarginRightVal =
					!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );

				body.removeChild( container );
			}

			return reliableMarginRightVal;
		}
	});

	function computeStyleTests() {
		var container, div,
			body = document.getElementsByTagName( "body" )[ 0 ];

		if ( !body ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		container = document.createElement( "div" );
		div = document.createElement( "div" );
		container.style.cssText = containerStyles;

		body.appendChild( container ).appendChild( div );

		div.style.cssText =
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:absolute;display:block;padding:1px;border:1px;width:4px;" +
				"margin-top:1%;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			boxSizingVal = div.offsetWidth === 4;
		});

		// Will be changed later if needed.
		boxSizingReliableVal = true;
		pixelPositionVal = false;
		reliableMarginRightVal = true;

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			pixelPositionVal = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			boxSizingReliableVal =
				( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE.
		div = body = null;
	}

})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,

	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing() && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					// Support: Chrome, Safari
					// Setting style to blank string required to delete "style: x !important;"
					style[ name ] = "";
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing() && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, dDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );
		dDisplay = defaultDisplay( elem.nodeName );
		if ( display === "none" ) {
			display = dDisplay;
		}
		if ( display === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || dDisplay === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var a, input, select, opt,
		div = document.createElement("div" );

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];

	// First batch of tests.
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// Null elements to avoid leaks in IE.
	a = input = select = opt = div = null;
})();


var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// Retrieve booleans specially
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		} :
		function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

// Support: Safari, IE9+
// mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	// XHR cannot access local files, always use ActiveX for that case
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	});
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( options ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch( e ) {
									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;
								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					if ( !options.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};





var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray("auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
window.jQuery = window.$ = jQuery;




return jQuery;

}));
;(function($) {
/*

jQuery-turtle
=============

version 2.0.8

jQuery-turtle is a jQuery plugin for turtle graphics.

With jQuery-turtle, every DOM element is a turtle that can be
moved using turtle graphics methods like fd (forward), bk (back),
rt (right turn), and lt (left turn).  The pen function allows
a turtle to draw on a full-document canvas as it moves.

<pre>
$('#turtle').pen('red').rt(90).fd(100).lt(90).bk(50).fadeOut();
</pre>

jQuery-turtle provides:
  * Relative and absolute motion and drawing.
  * Functions to ease basic input, output, and game-making for beginners.
  * Operations on sets of turtles, and turtle motion of arbitrary elements.
  * Accurate collision-testing of turtles with arbitrary convex hulls.
  * Simplified access to CSS3 transforms, jQuery animations, Canvas, and Web Audio.
  * An interactive turtle console in either Javascript or CoffeeScript.

The plugin can also create a learning environment with a default
turtle that is friendly for beginners.  The following is a complete
CoffeeScript program that uses the default turtle to draw a grid of
sixteen colored polygons.

<pre>
eval $.turtle()  # Create the default turtle.

speed 100
for color in [red, gold, green, blue]
  for sides in [3..6]
    pen color
    for x in [1..sides]
      fd 100 / sides
      lt 360 / sides
    pen null
    fd 40
  slide 40, -160
</pre>

[Try an interactive demo (CoffeeScript syntax) here.](
http://davidbau.github.io/jquery-turtle/demo.html)


JQuery Methods for Turtle Movement
----------------------------------

The turtle API is briefly summarized below.  All the following
turtle-oriented methods operate on any jQuery object (including
the default turtle, if used):

<pre>
$(q).fd(100)      // Forward relative motion in local coordinates.
$(q).bk(50)       // Back.
$(q).rt(90)       // Right turn.  Optional second arg is turning radius.
$(q).lt(45)       // Left turn.  Optional second arg is turning radius.
$(q).slide(x, y)  // Slide right by x while sliding forward by y.
$(q).jump(x, y)   // Like slide, but without drawing.
$(q).moveto({pageX:x,pageY:y} | [x,y])  // Absolute motion on page.
$(q).jumpto({pageX:x,pageY:y} | [x,y])  // Like moveto, without drawing.
$(q).turnto(direction || position)      // Absolute direction adjustment.
$(q).play("ccgg") // Plays notes using ABC notation and waits until done.

// Methods below happen in an instant, but line up in the animation queue.
$(q).home()       // Jumps to the center of the document, with direction 0.
$(q).pen('red')   // Sets a pen style, or 'none' for no drawing.
$(q).pu()         // Pen up - temporarily disables the pen (also pen(false)).
$(q).pd()         // Pen down - starts a new pen path.
$(q).pe()         // Uses the pen 'erase' style.
$(q).fill('gold') // Fills a shape previously outlined using pen('path').
$(q).dot(12)      // Draws a circular dot of diameter 12.  Color second arg.
$(q).label('A')   // Prints an HTML label at the turtle location.
$(q).speed(10)    // Sets turtle animation speed to 10 moves per sec.
$(q).ht()         // Hides the turtle.
$(q).st()         // Shows the turtle.
$(q).wear('blue') // Switches to a blue shell.  Use any image or color.
$(q).scale(1.5)   // Scales turtle size and motion by 150%.
$(q).twist(180)   // Changes which direction is considered "forward".
$(q).mirror(true) // Flips the turtle across its main axis.
$(q).reload()     // Reloads the turtle's image (restarting animated gifs)
$(q).done(fn)     // Like $(q).promise().done(fn). Calls after all animation.
$(q).plan(fn)     // Like each, but this is set to $(elt) instead of elt,
                  // and the callback fn can insert into the animation queue.

// Methods below this line do not queue for animation.
$(q).getxy()      // Local (center-y-up [x, y]) coordinates of the turtle.
$(q).pagexy()     // Page (topleft-y-down {pageX:x, pageY:y}) coordinates.
$(q).direction([p]) // The turtles absolute direction (or direction towards p).
$(q).distance(p)  // Distance to p in page coordinates.
$(q).shown()      // Shorthand for is(":visible")
$(q).hidden()     // Shorthand for !is(":visible")
$(q).touches(y)   // Collision tests elements (uses turtleHull if present).
$(q).inside(y)// Containment collision test.
$(q).nearest(pos) // Filters to item (or items if tied) nearest pos.
$(q).within(d, t) // Filters to items with centers within d of t.pagexy().
$(q).notwithin()  // The negation of within.
$(q).cell(y, x)   // Selects the yth row and xth column cell in a table.
$(q).hatch([n,] [img]) // Creates and returns n turtles with the given img.
</pre>


Speed and Turtle Animation
--------------------------

When the speed of a turtle is nonzero, the first nine movement
functions animate at that speed (in moves per second), and the
remaining mutators also participate in the animation queue.  The
default turtle speed is a leisurely one move per second (as
appropriate for the creature), but you may soon discover the
desire to set speed higher.

Setting the turtle speed to Infinity will make its movement synchronous,
which makes the synchronous distance, direction, and hit-testing useful
for realtime game-making.

Pen and Fill Styles
-------------------

The turtle pen respects canvas styling: any valid strokeStyle is
accepted; and also using a space-separated syntax, lineWidth, lineCap,
lineJoin, miterLimit, and fillStyle can be specified, e.g.,
pen('red lineWidth 5 lineCap square').  The same syntax applies for
styling dot and fill (except that the default interpretation for the
first value is fillStyle instead of strokeStyle).

The fill method is used by tracing an invisible path using the
pen('path') style, and then calling the fill method.  Disconnected
paths can be created using pu() and pd().

Conventions for Musical Notes
-----------------------------

The play method plays a sequence of notes specified using a subset of
standard ABC notation.  Capital C denotes middle C, and lowercase c is
an octave higher.  Pitches and durations can be altered with commas,
apostrophes, carets, underscores, digits, and slashes as in the
standard.  Enclosing letters in square brackets represents a chord,
and z represents a rest.  The default tempo is 120, but can be changed
by passing a options object as the first parameter setting tempo, e.g.,
{ tempo: 200 }.  Other options include volume: 0.5, type: 'sine' or
'square' or 'sawtooth' or 'triangle', and envelope: which defines
an ADSR envelope e.g., { a: 0.01, d: 0.2, s: 0.1, r: 0.1 }.

The turtle's motion will pause while it is playing notes.

Planning Logic in the Animation Queue
-------------------------------------

The plan method can be used to queue logic (including synchronous
tests or actions) by running a function in the animation queue.  Unlike
jquery queue(), plan arranges things so that if further animations
are queued by the callback function, they are inserted (in natural
recursive functional execution order) instead of being appended.

Turnto and Absolute Bearings
----------------------------

The turnto method can turn to an absolute direction (if called with a
single numeric argument) or towards an absolute position on the
screen.  The methods moveto and turnto accept either page or
graphing coordinates.

Moveto and Two Flavors of Cartesian Coordinates
-----------------------------------------------

Graphing coordinates are measured upwards and rightwards from the
center of the page, and they are specified as bare numeric x, y
arguments or [x, y] pairs as returned from getxy().

Page coordinates are specified by an object with pageX and pageY
properties, or with a pagexy() method that will return such an object.
That includes, usefullly, mouse events and turtle objects.  Page
coordinates are measured downward from the top-left corner of the
page to the center (or transform-origin) of the given object.

Hit Testing
-----------

The hit-testing functions touches() and inside() will test for
collisions using the convex hulls of the objects in question.
The hull of an element defaults to the bounding box of the element
(as transformed) but can be overridden by the turtleHull CSS property,
if present.  The default turtle is given a turtle-shaped hull.

The touches() function can also test for collisions with a color
on the canvas - use touches('red'), for example, or for collsisions
with any nontransparent color, use touches('color').

Turtle Teaching Environment
---------------------------

A default turtle together with an interactive console are created by
calling eval($.turtle()).  That call exposes all the turtle methods
such as (fd, rt, getxy, etc) as global functions operating on the default
turtle.  It will also set up a number of other global symbols to provide
beginners with a simplified programming environment.

In detail, after eval($.turtle()):
  * An &lt;img id="turtle"&gt; is created if #turtle doesn't already exist.
  * An eval debugging panel (see.js) is shown at the bottom of the screen.
  * Turtle methods on the default turtle are packaged as globals, e.g., fd(10).
  * Every #id element is turned into a global variable: window.id = $('#id').
  * Default turtle animation is set to 1 move per sec so steps can be seen.
  * Global event listeners are created to update global event variables.
  * Methods of $.turtle.* (enumerated below) are exposed as global functions.
  * String constants are defined for the 140 named CSS colors.

Beyond the functions to control the default turtle, the globals added by
$.turtle() are as follows:

<pre>
lastclick             // Event object of the last click event in the doc.
lastmousemove         // The last mousemove event.
lastmouseup           // The last mouseup event.
lastmousedown         // The last mousedown event.
keydown               // The last keydown event.
keyup                 // The last keyup event.
keypress              // The last keypress event.
hatch([n,] [img])     // Creates and returns n turtles with the given img.
cs()                  // Clears the screen, both the canvas and the body text.
cg()                  // Clears the graphics canvas without clearing the text.
ct()                  // Clears the text without clearing the canvas.
defaultspeed(mps)     // Sets $.fx.speeds.turtle to 1000 / mps.
timer(secs, fn)       // Calls back fn once after secs seconds.
tick([perSec,] fn)    // Repeatedly calls fn at the given rate (null clears).
done(fn)              // Calls back fn after all turtle animation is complete.
random(n)             // Returns a random number [0..n-1].
random(list)          // Returns a random element of the list.
random('normal')      // Returns a gaussian random (mean 0 stdev 1).
random('uniform')     // Returns a uniform random [0...1).
random('position')    // Returns a random {pageX:x, pageY:y} coordinate.
random('color')       // Returns a random hsl(*, 100%, 50%) color.
random('gray')        // Returns a random hsl(0, 0, *) gray.
remove()              // Removes default turtle and its globals (fd, etc).
see(a, b, c...)       // Logs tree-expandable data into debugging panel.
write(html)           // Appends html into the document body.
read([label,] fn)     // Makes a one-time input field, calls fn after entry.
readnum([label,] fn)  // Like read, but restricted to numeric input.
readstr([label,] fn)  // Like read, but never converts input to a number.
button([label,] fn)   // Makes a clickable button, calls fn when clicked.
table(m, n)           // Outputs a table with m rows and n columns.
play('[DFG][EGc]')    // Plays musical notes.
send(m, arg)          // Sends an async message to be received by recv(m, fn).
recv(m, fn)           // Calls fn once to receive one message sent by send.
</pre>

Here is another CoffeeScript example that demonstrates some of
the functions:

<pre>
eval $.turtle()  # Create the default turtle and global functions.

defaultspeed Infinity
write "Catch blue before red gets you."
bk 100
r = hatch red
b = hatch blue
tick 10, ->
  turnto lastmousemove
  fd 6
  r.turnto turtle
  r.fd 4
  b.turnto direction b
  b.fd 3
  if b.touches(turtle)
    write "You win!"
    tick off
  else if r.touches(turtle)
    write "Red got you!"
    tick off
  else if not b.inside(document)
    write "Blue got away!"
    tick off
</pre>

The turtle teaching environment is designed to work well with either
Javascript or CoffeeScript.

JQuery CSS Hooks for Turtle Geometry
------------------------------------

Underlying turtle motion are turtle-oriented 2d transform jQuery cssHooks,
with animation support on all motion:

<pre>
$(q).css('turtleSpeed', '10');         // speed in moves per second.
$(q).css('turtleEasing', 'linear');    // animation easing, defaults to swing.
$(q).css('turtlePosition', '30 40');   // position in local coordinates.
$(q).css('turtlePositionX', '30px');   // x component.
$(q).css('turtlePositionY', '40px');   // y component.
$(q).css('turtleRotation', '90deg');   // rotation in degrees.
$(q).css('turtleScale', '2');          // double the size of any element.
$(q).css('turtleScaleX', '2');         // x stretch after twist.
$(q).css('turtleScaleY', '2');         // y stretch after twist.
$(q).css('turtleTwist', '45deg');      // turn before stretching.
$(q).css('turtleForward', '50px');     // position in direction of rotation.
$(q).css('turtleTurningRadius, '50px');// arc turning radius for rotation.
$(q).css('turtlePenStyle', 'red');     // or 'red lineWidth 2px' etc.
$(q).css('turtlePenDown', 'up');       // default 'down' to draw with pen.
$(q).css('turtleHull', '5 0 0 5 0 -5');// fine-tune shape for collisions.
</pre>

Arbitrary 2d transforms are supported, including transforms of elements
nested within other elements that have css transforms. For example, arc
paths of a turtle within a skewed div will transform to the proper elliptical
arc.  Note that while turtle motion is transformed, lines and dots are not:
for example, dots are always circular.  To get transformed circles, trace
out an arc.

Transforms on the turtle itself are used to infer the turtle position,
direction, and rendering of the sprite.  ScaleY stretches the turtle
sprite in the direction of movement also stretches distances for
motion in all directions.  ScaleX stretches the turtle sprite perpendicular
to the direction of motion and also stretches line and dot widths for
drawing.

A canvas is supported for drawing, but only created when the pen is
used; pen styles include canvas style properties such as lineWidth
and lineCap.

A convex hull polygon can be set to be used by the collision detection
and hit-testing functions (inside, touches).  The turtleHull is a list
of (unrotated) x-y coordinates relative to the object's transformOrigin.
If set to 'auto' (the default) the hull is just the bounding box for the
element.

License (MIT)
-------------

Copyright (c) 2013 David Bau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

//////////////////////////////////////////////////////////////////////////
// PREREQUISTIES
// Establish support for transforms in this browser.
//////////////////////////////////////////////////////////////////////////

var undefined = void 0,
    __hasProp = {}.hasOwnProperty,
    rootjQuery = jQuery(function() {}),
    Pencil, Turtle,
    global_plan_counter = 0;

function __extends(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)) child[key] = parent[key];
  }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

if (!$.cssHooks) {
  throw("jQuery 1.4.3+ is needed for jQuery-turtle to work");
}

// Determine the name of the 'transform' css property.
function styleSupport(prop) {
  var vendorProp, supportedProp,
      capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      prefixes = [ "Moz", "Webkit", "O", "ms" ],
      div = document.createElement("div");
  if (prop in div.style) {
    supportedProp = prop;
  } else {
    for (var i = 0; i < prefixes.length; i++) {
      vendorProp = prefixes[i] + capProp;
      if (vendorProp in div.style) {
        supportedProp = vendorProp;
        break;
      }
    }
  }
  div = null;
  $.support[prop] = supportedProp;
  return supportedProp;
}
function hasGetBoundingClientRect() {
  var div = document.createElement("div"),
      result = ('getBoundingClientRect' in div);
  div = null;
  return result;
}
var transform = styleSupport("transform"),
    transformOrigin = styleSupport("transformOrigin");

if (!transform || !hasGetBoundingClientRect()) {
  // Need transforms and boundingClientRects to support turtle methods.
  return;
}

//////////////////////////////////////////////////////////////////////////
// MATH
// 2d matrix support functions.
//////////////////////////////////////////////////////////////////////////

function identity(x) { return x; }

// Handles both 2x2 and 2x3 matrices.
function matrixVectorProduct(a, v) {
  var r = [a[0] * v[0] + a[2] * v[1], a[1] * v[0] + a[3] * v[1]];
  if (a.length == 6) {
    r[0] += a[4];
    r[1] += a[5];
  }
  return r;
}

// Multiplies 2x2 or 2x3 matrices.
function matrixProduct(a, b) {
  var r = [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3]
  ];
  var along = (a.length == 6);
  if (b.length == 6) {
    r.push(a[0] * b[4] + a[2] * b[5] + (along ? a[4] : 0));
    r.push(a[1] * b[4] + a[3] * b[5] + (along ? a[5] : 0));
  } else if (along) {
    r.push(a[4]);
    r.push(a[5]);
  }
  return r;
}

function nonzero(e) {
  // Consider zero any deviations less than one in a trillion.
  return Math.abs(e) > 1e-12;
}

function isone2x2(a) {
  return !nonzero(a[1]) && !nonzero(a[2]) &&
      !nonzero(1 - a[0]) && !nonzero(1 - a[3]);
}

function inverse2x2(a) {
  if (isone2x2(a)) { return [1, 0, 0, 1]; }
  var d = decomposeSVD(a);
  // Degenerate matrices have no inverse.
  if (!nonzero(d[2])) return null;
  return matrixProduct(
      rotation(-(d[3])), matrixProduct(
      scale(1/d[1], 1/d[2]),
      rotation(-(d[0]))));
}

function rotation(theta) {
  var c = Math.cos(theta),
      s = Math.sin(theta);
  return [c, s, -s, c];
}

function scale(sx, sy) {
  if (arguments.length == 1) { sx = sy; }
  return [sx, 0, 0, sy];
}

function addVector(v, a) {
  return [v[0] + a[0], v[1] + a[1]];
}

function subtractVector(v, s) {
  return [v[0] - s[0], v[1] - s[1]];
}

function scaleVector(v, s) {
  return [v[0] * s, v[1] * s];
}

function translatedMVP(m, v, origin) {
  return addVector(matrixVectorProduct(m, subtractVector(v, origin)), origin);
}

// decomposeSVD:
//
// Decomposes an arbitrary 2d matrix into a rotation, an X-Y scaling,
// and a prescaling rotation (which we call a "twist").  The prescaling
// rotation is only nonzero when there is some skew (i.e, a stretch that
// does not preserve rectilinear angles in the source).
//
// This decomposition is stable, which means that the product of
// the three components is always within near machine precision
// (about ~1e-15) of the original matrix.
//
// Input:  [m11, m21, m12, m22] in column-first order.
// Output: [rotation, scalex, scaley, twist] with rotations in radians.
//
// The decomposition is the unique 2d SVD permuted to fit the contraints:
//  * twist is between +- pi/4
//  * rotation is between +- pi/2
//  * scalex + scaley >= 0.
function decomposeSVD(m) {
  var // Compute M*M
      mtm0 = m[0] * m[0] + m[1] * m[1],
      mtm12 = m[0] * m[2] + m[1] * m[3],
      mtm3 = m[2] * m[2] + m[3] * m[3],
      // Compute right-side rotation.
      phi = -0.5 * Math.atan2(mtm12 * 2, mtm0 - mtm3),
      v0 = Math.cos(phi),
      v1 = Math.sin(phi),  // [v0 v1 -v1 v0]
      // Compute left-side rotation.
      mvt0 = (m[0] * v0 - m[2] * v1),
      mvt1 = (m[1] * v0 - m[3] * v1),
      theta = Math.atan2(mvt1, mvt0),
      u0 = Math.cos(theta),
      u1 = Math.sin(theta),  // [u0 u1 -u1 u0]
      // Compute the singular values.  Notice by computing in this way,
      // the sign is pushed into the smaller singular value.
      sv2c = (m[1] * v1 + m[3] * v0) * u0 - (m[0] * v1 + m[2] * v0) * u1,
      sv1c = (m[0] * v0 - m[2] * v1) * u0 + (m[1] * v0 - m[3] * v1) * u1,
      sv1, sv2;
  // Put phi between -pi/4 and pi/4.
  if (phi < -Math.PI / 4) {
    phi += Math.PI / 2;
    sv2 = sv1c;
    sv1 = sv2c;
    theta -= Math.PI / 2;
  } else {
    sv1 = sv1c;
    sv2 = sv2c;
  }
  // Put theta between -pi and pi.
  if (theta > Math.PI) { theta -= 2 * Math.PI; }
  return [theta, sv1, sv2, phi];
}

// approxBezierUnitArc:
// Returns three bezier curve control points that approximate
// a a unit circle arc from angle a1 to a2 (not including the
// beginning point, which would just be at cos(a1), sin(a1)).
// For a discussion and derivation of this formula,
// google [riskus approximating circular arcs]
function approxBezierUnitArc(a1, a2) {
  var a = (a2 - a1) / 2,
      x4 = Math.cos(a),
      y4 = Math.sin(a),
      x1 = x4,
      y1 = -y4,
      q2 = 1 + x1 * x4 + y1 * y4,
      d = (x1 * y4 - y1 * x4),
      k2 = d && (4/3 * (Math.sqrt(2 * q2) - q2) / d),
      x2 = x1 - k2 * y1,
      y2 = y1 + k2 * x1,
      x3 = x2,
      y3 = -y2,
      ar = a + a1,
      car = Math.cos(ar),
      sar = Math.sin(ar);
  return [
     [x2 * car - y2 * sar, x2 * sar + y2 * car],
     [x3 * car - y3 * sar, x3 * sar + y3 * car],
     [Math.cos(a2), Math.sin(a2)]
  ];
}

//////////////////////////////////////////////////////////////////////////
// CSS TRANSFORMS
// Basic manipulation of 2d CSS transforms.
//////////////////////////////////////////////////////////////////////////

function getElementTranslation(elem) {
  var ts = readTurtleTransform(elem, false);
  if (ts) { return [ts.tx, ts.ty]; }
  var m = readTransformMatrix(elem);
  if (m) { return [m[4], m[5]]; }
  return [0, 0];
}

// Reads out the 2x3 transform matrix of the given element.
function readTransformMatrix(elem) {
  var ts = (window.getComputedStyle ?
      window.getComputedStyle(elem)[transform] :
      $.css(elem, 'transform'));
  if (!ts || ts === 'none') {
    return null;
  }
  // Quick exit on the explicit matrix() case:
  var e =/^matrix\(([\-+.\de]+),\s*([\-+.\de]+),\s*([\-+.\de]+),\s*([\-+.\de]+),\s*([\-+.\de]+)(?:px)?,\s*([\-+.\de]+)(?:px)?\)$/.exec(ts);
  if (e) {
    return [parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]),
            parseFloat(e[4]), parseFloat(e[5]), parseFloat(e[6])];
  }
  // Interpret the transform string.
  return transformStyleAsMatrix(ts);
}

// Reads out the css transformOrigin property, if present.
function readTransformOrigin(elem, wh) {
  var gcs = (window.getComputedStyle ?  window.getComputedStyle(elem) : null),
      origin = (gcs && gcs[transformOrigin] || $.css(elem, 'transformOrigin'));
  if (origin && origin.indexOf('%') < 0) {
    return $.map(origin.split(' '), parseFloat);
  }
  if (wh) {
    return [wh[0] / 2, wh[1] / 2];
  }
  var sel = $(elem);
  return [sel.width() / 2, sel.height() / 2];
}

// Composes all the 2x2 transforms up to the top.
function totalTransform2x2(elem) {
  var result = [1, 0, 0, 1], t;
  while (elem !== null) {
    t = readTransformMatrix(elem);
    if (t && !isone2x2(t)) {
      result = matrixProduct(t, result);
    }
    elem = elem.parentElement;
  }
  return result.slice(0, 4);
}

// Applies the css 2d transforms specification.
function transformStyleAsMatrix(transformStyle) {
  // Deal with arbitrary transforms:
  var result = [1, 0, 0, 1], ops = [], args = [],
      pat = /(?:^\s*|)(\w*)\s*\(([^)]*)\)\s*/g,
      unknown = transformStyle.replace(pat, function(m) {
        ops.push(m[1].toLowerCase());
        args.push($.map(m[2].split(','), function(s) {
          var v = s.trim().toLowerCase();
          return {
            num: parseFloat(v),
            unit: v.replace(/^[+-.\de]*/, '')
          };
        }));
        return '';
      });
  if (unknown) { return null; }
  for (var index = ops.length - 1; index >= 0; --index) {
    var m = null, a, c, s, t;
    var op = ops[index];
    var arg = args[index];
    if (op == 'matrix') {
      if (arg.length >= 6) {
        m = [arg[0].num, arg[1].num, arg[2].num, arg[3].num,
             arg[4].num, arg[5].num];
      }
    } else if (op == 'rotate') {
      if (arg.length == 1) {
        a = convertToRadians(arg[0]);
        c = Math.cos(a);
        s = Math.sin(a);
        m = [c, -s, c, s];
      }
    } else if (op == 'translate' || op == 'translatex' || op == 'translatey') {
      var tx = 0, ty = 0;
      if (arg.length >= 1) {
        if (arg[0].unit && arg[0].unit != 'px') { return null; } // non-pixels
        if (op == 'translate' || op == 'translatex') { tx = arg[0].num; }
        else if (op == 'translatey') { ty = arg[0].num; }
        if (op == 'translate' && arg.length >= 2) {
          if (arg[1].unit && arg[1].unit != 'px') { return null; }
          ty = arg[1].num;
        }
        m = [0, 0, 0, 0, tx, ty];
      }
    } else if (op == 'scale' || op == 'scalex' || op == 'scaley') {
      var sx = 1, sy = 1;
      if (arg.length >= 1) {
        if (op == 'scale' || op == 'scalex') { sx = arg[0].num; }
        else if (op == 'scaley') { sy = arg[0].num; }
        if (op == 'scale' && arg.length >= 2) { sy = arg[1].num; }
        m = [sx, 0, 0, sy, 0, 0];
      }
    } else if (op == 'skew' || op == 'skewx' || op == 'skewy') {
      var kx = 0, ky = 0;
      if (arg.length >= 1) {
        if (op == 'skew' || op == 'skewx') {
          kx = Math.tan(convertToRadians(arg[0]));
        } else if (op == 'skewy') {
          ky = Math.tan(convertToRadians(arg[0]));
        }
        if (op == 'skew' && arg.length >= 2) {
          ky = Math.tan(convertToRadians(arg[0]));
        }
        m = [1, ky, kx, 1, 0, 0];
      }
    } else {
      // Unrecgonized transformation.
      return null;
    }
    result = matrixProduct(result, m);
  }
  return result;
}

//////////////////////////////////////////////////////////////////////////
// ABSOLUTE PAGE POSITIONING
// Dealing with the element origin, rectangle, and direction on the page,
// taking into account nested parent transforms.
//////////////////////////////////////////////////////////////////////////

function limitMovement(start, target, limit) {
  if (limit <= 0) return start;
  var distx = target.pageX - start.pageX,
      disty = target.pageY - start.pageY,
      dist2 = distx * distx + disty * disty;
  if (limit * limit >= dist2) {
    return target;
  }
  var frac = limit / Math.sqrt(dist2);
  return {
    pageX: start.pageX + frac * distx,
    pageY: start.pageY + frac * disty
  };
}

function limitRotation(start, target, limit) {
  if (limit <= 0) { target = start; }
  else if (limit < 180) {
    var delta = normalizeRotation(target - start);
    if (delta > limit) { target = start + limit; }
    else if (delta < -limit) { target = start - limit; }
  }
  return normalizeRotation(target);
}

function getRoundedCenterLTWH(x0, y0, w, h) {
  return { pageX: Math.floor(x0 + w / 2), pageY: Math.floor(y0 + h / 2) };
}

function getStraightRectLTWH(x0, y0, w, h) {
  var x1 = x0 + w, y1 = y0 + h;
  return [
    { pageX: x0, pageY: y0 },
    { pageX: x0, pageY: y1 },
    { pageX: x1, pageY: y1 },
    { pageX: x1, pageY: y0 }
  ];
}

function cleanedStyle(trans) {
  // Work around FF bug: the browser generates CSS transforms with nums
  // with exponents like 1e-6px that are not allowed by the CSS spec.
  // And yet it doesn't accept them when set back into the style object.
  // So $.swap doesn't work in these cases.  Therefore, we have a cleanedSwap
  // that cleans these numbers before setting them back.
  if (!/e[\-+]/.exec(trans)) {
    return trans;
  }
  var result = trans.replace(/(?:\d+(?:\.\d*)?|\.\d+)e[\-+]\d+/g, function(e) {
    return cssNum(parseFloat(e)); });
  return result;
}

function getTurtleOrigin(elem, inverseParent, corners) {
  var hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      substTransform = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      old = {}, name, gbcr;
  for (name in swapout) {
    old[name] = elem.style[name];
    elem.style[name] = swapout[name];
  }
  gbcr = getPageGbcr(elem);
  for (name in swapout) {
    elem.style[name] = cleanedStyle(old[name]);
  }
  if (corners) {
    corners.gbcr = gbcr;
  }
  return addVector(
      [gbcr.left, gbcr.top],
      readTransformOrigin(elem, [gbcr.width, gbcr.height]));
}

function unattached(elt) {
  // Unattached if not part of a document.
  while (elt) {
    if (elt.nodeType === 9) return false;
    elt = elt.parentNode;
  }
  return true;
}

function wh() {
  // Quirks-mode compatible window height.
  return window.innerHeight || $(window).height();
}

function ww() {
  // Quirks-mode compatible window width.
  return window.innerWidth || $(window).width();
}

function dh() {
  return document.body ? $(document).height() : document.height;
}

function dw() {
  return document.body ? $(document).width() : document.width;
}

function makeGbcrLTWH(left, top, width, height) {
  return {
    left: left, top: top, right: left + width, bottom: top + height,
    width: width, height: height
  };
}

function getPageGbcr(elem) {
  if (isPageCoordinate(elem)) {
    return makeGbcrLTWH(elem.pageX, elem.pageY, 0, 0);
  } else if ($.isWindow(elem)) {
    return makeGbcrLTWH(
        $(window).scrollLeft(), $(window).scrollTop(), ww(), wh());
  } else if (elem.nodeType === 9) {
    return makeGbcrLTWH(0, 0, dw(), dh());
  } else if (!('getBoundingClientRect' in elem)) {
    return makeGbcrLTWH(0, 0, 0, 0);
  }
  return readPageGbcr.apply(elem);
}

function isGbcrOutside(center, d2, gbcr) {
  var dy = Math.max(0,
           Math.max(gbcr.top - center.pageY, center.pageY - gbcr.bottom)),
      dx = Math.max(0,
           Math.max(gbcr.left - center.pageX, center.pageX - gbcr.right));
  return dx * dx + dy * dy > d2;
}

function isGbcrInside(center, d2, gbcr) {
  var dy = Math.max(gbcr.bottom - center.pageY, center.pageY - gbcr.top),
      dx = Math.max(gbcr.right - center.pageX, center.pageX - gbcr.left);
  return dx * dx + dy * dy < d2;
}

function isDisjointGbcr(gbcr0, gbcr1) {
  return (gbcr1.right < gbcr0.left || gbcr0.right < gbcr1.left ||
          gbcr1.bottom < gbcr0.top || gbcr0.bottom < gbcr1.top);
}

function gbcrEncloses(gbcr0, gbcr1) {
  return (gbcr1.top >= gbcr0.top && gbcr1.bottom <= gbcr0.bottom &&
          gbcr1.left >= gbcr0.left && gbcr1.right <= gbcr0.right);
}

function polyMatchesGbcr(poly, gbcr) {
  return (poly.length === 4 &&
      poly[0].pageX === gbcr.left && poly[0].pageY === gbcr.top &&
      poly[1].pageX === gbcr.left && poly[1].pageY === gbcr.bottom &&
      poly[2].pageX === gbcr.right && poly[2].pageY === gbcr.bottom &&
      poly[3].pageX === gbcr.right && poly[3].pageY === gbcr.top);
}

function readPageGbcr() {
  var raw = this.getBoundingClientRect();
  if (raw.width === 0 && raw.height === 0 &&
     raw.top === 0 && raw.left === 0 && unattached(this)) {
    // Prentend unattached images have a size.
    return {
      top: 0,
      bottom: this.height || 0,
      left: 0,
      right: this.width || 0,
      width: this.width || 0,
      height: this.height || 0
    }
  }
  return {
    top: raw.top + window.pageYOffset,
    bottom: raw.bottom + window.pageYOffset,
    left: raw.left + window.pageXOffset,
    right: raw.right + window.pageXOffset,
    width: raw.width,
    height: raw.height
  };
}

// Temporarily eliminate transform (but reverse parent distortions)
// to get origin position; then calculate displacement needed to move
// turtle to target coordinates (again reversing parent distortions
// if possible).
function computeTargetAsTurtlePosition(elem, target, limit, localx, localy) {
  var totalParentTransform = totalTransform2x2(elem.parentElement),
      inverseParent = inverse2x2(totalParentTransform),
      origin = getTurtleOrigin(elem, inverseParent),
      pos, current, tr, localTarget;
  if (!inverseParent) { return; }
  if ($.isNumeric(limit)) {
    tr = getElementTranslation(elem);
    pos = addVector(matrixVectorProduct(totalParentTransform, tr), origin);
    current = {
      pageX: pos[0],
      pageY: pos[1]
    };
    target = limitMovement(current, target, limit);
  }
  localTarget = matrixVectorProduct(inverseParent,
      subtractVector([target.pageX, target.pageY], origin));
  if (localx || localy) {
    var ts = readTurtleTransform(elem, true),
        sy = ts ? ts.sy : 1;
    localTarget[0] += localx * sy;
    localTarget[1] -= localy * sy;
  }
  return cssNum(localTarget[0]) + ' ' + cssNum(localTarget[1]);
}

function homeContainer(elem) {
  var container = elem.offsetParent;
  if (!container) {
    return document;
  }
  return container;
}

// Compute the home position and the turtle location in local turtle
// coordinates; return the local offset from the home position as
// an array of len 2.
function computePositionAsLocalOffset(elem, home) {
  if (!home) {
    home = $(homeContainer(elem)).pagexy();
  }
  var totalParentTransform = totalTransform2x2(elem.parentElement),
      inverseParent = inverse2x2(totalParentTransform),
      origin = getTurtleOrigin(elem, inverseParent),
      ts = readTurtleTransform(elem, true),
      localHome = inverseParent && matrixVectorProduct(inverseParent,
          subtractVector([home.pageX, home.pageY], origin)),
      isy = ts && 1 / ts.sy;
  if (!inverseParent) { return; }
  return [(ts.tx - localHome[0]) * isy, (localHome[1] - ts.ty) * isy];
}

function convertLocalXyToPageCoordinates(elem, localxy) {
  var totalParentTransform = totalTransform2x2(elem.parentElement),
      ts = readTurtleTransform(elem, true),
      center = $(homeContainer(elem)).pagexy(),
      result = [],
      pageOffset, j;
  for (j = 0; j < localxy.length; j++) {
    pageOffset = matrixVectorProduct(
        totalParentTransform, [localxy[j][0] * ts.sy, -localxy[j][1] * ts.sy]);
    result.push({ pageX: center.pageX + pageOffset[0],
                  pageY: center.pageY + pageOffset[1] });
  }
  return result;
}

// Uses getBoundingClientRect to figure out current position in page
// coordinates.  Works by backing out local transformation (and inverting
// any parent rotations and distortions) so that the bounding rect is
// rectilinear; then reapplies translation (under any parent distortion)
// to get the final x and y, returned as {pageX:, pagey:}.
function getCenterInPageCoordinates(elem) {
  if ($.isWindow(elem)) {
    return getRoundedCenterLTWH(
        $(window).scrollLeft(), $(window).scrollTop(), ww(), wh());
  } else if (elem.nodeType === 9 || elem == document.body) {
    return getRoundedCenterLTWH(0, 0, dw(), dh());
  }
  var state = getTurtleData(elem);
  if (state && state.quickpagexy && state.down) {
    return state.quickpagexy;
  }
  var tr = getElementTranslation(elem),
      totalParentTransform = totalTransform2x2(elem.parentElement),
      simple = isone2x2(totalParentTransform),
      inverseParent = simple ? null : inverse2x2(totalParentTransform),
      origin = getTurtleOrigin(elem, inverseParent),
      pos = addVector(matrixVectorProduct(totalParentTransform, tr), origin),
      result = { pageX: pos[0], pageY: pos[1] };
  if (state && simple && state.down) {
    state.quickpagexy = result;
  }
  return result;
}

function polyToVectorsOffset(poly, offset) {
  if (!poly) { return null; }
  var result = [], j = 0;
  for (; j < poly.length; ++j) {
    result.push([poly[j].pageX + offset[0], poly[j].pageY + offset[1]]);
  }
  return result;
}

// Uses getBoundingClientRect to figure out the corners of the
// transformed parallelogram in page coordinates.
function getCornersInPageCoordinates(elem, untransformed) {
  if ($.isWindow(elem)) {
    return getStraightRectLTWH(
        $(window).scrollLeft(), $(window).scrollTop(), ww(), wh());
  } else if (elem.nodeType === 9) {
    return getStraightRectLTWH(0, 0, dw(), dh());
  }
  var currentTransform = readTransformMatrix(elem) || [1, 0, 0, 1],
      totalParentTransform = totalTransform2x2(elem.parentElement),
      totalTransform = matrixProduct(totalParentTransform, currentTransform),
      inverseParent = inverse2x2(totalParentTransform),
      out = {},
      origin = getTurtleOrigin(elem, inverseParent),
      gbcr = out.gbcr,
      hull = polyToVectorsOffset(getTurtleData(elem).hull, origin) || [
        [gbcr.left, gbcr.top],
        [gbcr.left, gbcr.bottom],
        [gbcr.right, gbcr.bottom],
        [gbcr.right, gbcr.top]
      ];
  if (untransformed) {
    // Used by the turtleHull css getter hook.
    return $.map(hull, function(pt) {
      return { pageX: pt[0] - origin[0], pageY: pt[1] - origin[1] };
    });
  }
  return $.map(hull, function(pt) {
    var tpt = translatedMVP(totalTransform, pt, origin);
    return { pageX: tpt[0], pageY: tpt[1] };
  });
}

function getDirectionOnPage(elem) {
  var ts = readTurtleTransform(elem, true),
      r = convertToRadians(normalizeRotation(ts.rot)),
      ux = Math.sin(r), uy = Math.cos(r),
      totalParentTransform = totalTransform2x2(elem.parentElement),
      up = matrixVectorProduct(totalParentTransform, [ux, uy]);
      dp = Math.atan2(up[0], up[1]);
  return radiansToDegrees(dp);
}

function scrollWindowToDocumentPosition(pos, limit) {
  var tx = pos.pageX,
      ty = pos.pageY,
      ww2 = ww() / 2,
      wh2 = wh() / 2,
      b = $('body'),
      dw = b.width(),
      dh = b.height(),
      w = $(window);
  if (tx > dw - ww2) { tx = dw - ww2; }
  if (tx < ww2) { tx = ww2; }
  if (ty > dh - wh2) { ty = dh - wh2; }
  if (ty < wh2) { ty = wh2; }
  targ = { pageX: tx, pageY: ty };
  if ($.isNumeric(limit)) {
    targ = limitMovement(w.origin(), targ, limit);
  }
  w.scrollLeft(targ.pageX - ww2);
  w.scrollTop(targ.pageY - wh2);
}

//////////////////////////////////////////////////////////////////////////
// HIT DETECTION AND COLLISIONS
// Deal with touching and enclosing element rectangles taking
// into account distortions from transforms.
//////////////////////////////////////////////////////////////////////////

function signedTriangleArea(pt0, pt1, pt2) {
  var x1 = pt1.pageX - pt0.pageX,
      y1 = pt1.pageY - pt0.pageY,
      x2 = pt2.pageX - pt0.pageX,
      y2 = pt2.pageY - pt0.pageY;
  return x2 * y1 - x1 * y2;
}

function signedDeltaTriangleArea(pt0, diff1, pt2) {
  var x2 = pt2.pageX - pt0.pageX,
      y2 = pt2.pageY - pt0.pageY;
  return x2 * diff1.pageY - diff1.pageX * y2;
}

function pointInConvexPolygon(pt, poly) {
  // Implements top google hit algorithm for
  // ["An efficient test for a point to be in a convex polygon"]
  if (poly.length <= 0) { return false; }
  if (poly.length == 1) {
    return poly[0].pageX == pt.pageX && poly[0].pageY == pt.pageY;
  }
  var a0 = signedTriangleArea(pt, poly[poly.length - 1], poly[0]);
  if (a0 === 0) { return true; }
  var positive = (a0 > 0);
  if (poly.length == 2) { return false; }
  for (var j = 1; j < poly.length; ++j) {
    var aj = signedTriangleArea(pt, poly[j - 1], poly[j]);
    if (aj === 0) { return true; }
    if ((aj > 0) != positive) { return false; }
  }
  return true;
}

function diff(v1, v0) {
  return { pageX: v1.pageX - v0.pageX, pageY: v1.pageY - v0.pageY };
}

// Given an edge [p0, p1] of polygon P, and the expected sign of [p0, p1, p]
// for p inside P, then determine if all points in the other poly have the
// opposite sign.
function edgeSeparatesPointAndPoly(inside, p0, p1, poly) {
  var d1 = diff(p1, p0), j, s;
  for (j = 0; j < poly.length; ++j) {
    s = sign(signedDeltaTriangleArea(p0, d1, poly[j]));
    if (!s || s === inside) { return false; }
  }
  return true;
}

function sign(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

function convexPolygonSign(poly) {
  if (poly.length <= 2) { return 0; }
  var a = signedTriangleArea(poly[poly.length - 1], poly[0], poly[1]);
  if (a !== 0) { return sign(a); }
  for (var j = 1; j < poly.length; ++j) {
    a = signedTriangleArea(poly[j - 1], poly[j], poly[(j + 1) % poly.length]);
    if (a !== 0) { return sign(a); }
  }
  return 0;
}

function doConvexPolygonsOverlap(poly1, poly2) {
  // Implements top google hit for
  // ["polygon collision" gpwiki]
  var sign = convexPolygonSign(poly1), j;
  for (j = 0; j < poly1.length; ++j) {
    if (edgeSeparatesPointAndPoly(
        sign, poly1[j], poly1[(j + 1) % poly1.length], poly2)) {
      return false;
    }
  }
  sign = convexPolygonSign(poly2);
  for (j = 0; j < poly2.length; ++j) {
    if (edgeSeparatesPointAndPoly(
        sign, poly2[j], poly2[(j + 1) % poly2.length], poly1)) {
      return false;
    }
  }
  return true;
}

function doesConvexPolygonContain(polyOuter, polyInner) {
  // Just verify all vertices of polyInner are inside.
  for (var j = 0; j < polyInner.length; ++j) {
    if (!pointInConvexPolygon(polyInner[j], polyOuter)) {
      return false;
    }
  }
  return true;
}

// Google search for [Graham Scan Tom Switzer].
function convexHull(points) {
  function keepLeft(hull, r) {
    if (!r || !isPageCoordinate(r)) { return hull; }
    while (hull.length > 1 && sign(signedTriangleArea(hull[hull.length - 2],
        hull[hull.length - 1], r)) != 1) { hull.pop(); }
    if (!hull.length || !equalPoint(hull[hull.length - 1], r)) { hull.push(r); }
    return hull;
  }
  function reduce(arr, valueInitial, fnReduce) {
    for (var j = 0; j < arr.length; ++j) {
      valueInitial = fnReduce(valueInitial, arr[j]);
    }
    return valueInitial;
  }
  function equalPoint(p, q) {
    return p.pageX === q.pageX && p.pageY === q.pageY;
  }
  function lexicalPointOrder(p, q) {
    return p.pageX < q.pageX ? -1 : p.pageX > q.pageX ? 1 :
           p.pageY < q.pageY ? -1 : p.pageY > q.pageY ? 1 : 0;
  }
  points.sort(lexicalPointOrder);
  var leftdown = reduce(points, [], keepLeft),
      rightup = reduce(points.reverse(), [], keepLeft);
  return leftdown.concat(rightup.slice(1, -1));
}

function parseTurtleHull(text) {
  if (!text) return null;
  var nums = $.map(text.trim().split(/\s+/), parseFloat), points = [], j = 0;
  while (j + 1 < nums.length) {
    points.push({ pageX: nums[j], pageY: nums[j + 1] });
    j += 2;
  }
  return points;
}

function readTurtleHull(elem) {
  return getTurtleData(elem).hull;
}

function writeTurtleHull(hull) {
  for (var j = 0, result = []; j < hull.length; ++j) {
    result.push(hull[j].pageX, hull[j].pageY);
  }
  return result.length ? $.map(result, cssNum).join(' ') : 'none';
}

function makeHullHook() {
  return {
    get: function(elem, computed, extra) {
      var hull = getTurtleData(elem).hull;
      return writeTurtleHull(hull ||
          getCornersInPageCoordinates(elem, true));
    },
    set: function(elem, value) {
      var hull =
        !value || value == 'auto' ? null :
        value == 'none' ? [] :
        convexHull(parseTurtleHull(value));
      getTurtleData(elem).hull = hull;
    }
  };
}

//////////////////////////////////////////////////////////////////////////
// TURTLE CSS CONVENTIONS
// For better performance, the turtle library always writes transform
// CSS in a canonical form; and it reads this form faster than generic
// matrices.
//////////////////////////////////////////////////////////////////////////

// The canonical 2D transforms written by this plugin have the form:
// translate(tx, ty) rotate(rot) scale(sx, sy) rotate(twi)
// (with each component optional).
// This function quickly parses this form into a canonicalized object.
function parseTurtleTransform(transform) {
  if (transform === 'none') {
    return {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
  }
  // Note that although the CSS spec doesn't allow 'e' in numbers, IE10
  // and FF put them in there; so allow them.
  var e = /^(?:translate\(([\-+.\de]+)(?:px)?,\s*([\-+.\de]+)(?:px)?\)\s*)?(?:rotate\(([\-+.\de]+)(?:deg)?\)\s*)?(?:scale\(([\-+.\de]+)(?:,\s*([\-+.\de]+))?\)\s*)?(?:rotate\(([\-+.\de]+)(?:deg)?\)\s*)?$/.exec(transform);
  if (!e) { return null; }
  var tx = e[1] ? parseFloat(e[1]) : 0,
      ty = e[2] ? parseFloat(e[2]) : 0,
      rot = e[3] ? parseFloat(e[3]) : 0,
      sx = e[4] ? parseFloat(e[4]) : 1,
      sy = e[5] ? parseFloat(e[5]) : sx,
      twi = e[6] ? parseFloat(e[6]) : 0;
  return {tx:tx, ty:ty, rot:rot, sx:sx, sy:sy, twi:twi};
}

function computeTurtleTransform(elem) {
  var m = readTransformMatrix(elem), d;
  if (!m) {
    return {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
  }
  d = decomposeSVD(m);
  return {
    tx: m[4], ty: m[5], rot: radiansToDegrees(d[0]),
    sx: d[1], sy: d[2], twi: radiansToDegrees(d[3])
  };
}

function readTurtleTransform(elem, computed) {
  return parseTurtleTransform(elem.style[transform]) ||
      (computed && computeTurtleTransform(elem));
}

function cssNum(n) {
  var r = n.toString();
  if (r.indexOf('e') >= 0) {
    r = Number(n).toFixed(17);
  }
  return r;
}

function writeTurtleTransform(ts) {
  var result = [];
  if (nonzero(ts.tx) || nonzero(ts.ty)) {
    result.push(
      'translate(' + cssNum(ts.tx) + 'px, ' + cssNum(ts.ty) + 'px)');
  }
  if (nonzero(ts.rot) || nonzero(ts.twi)) {
    result.push('rotate(' + cssNum(ts.rot) + 'deg)');
  }
  if (nonzero(1 - ts.sx) || nonzero(1 - ts.sy)) {
    if (nonzero(ts.sx - ts.sy)) {
      result.push('scale(' + cssNum(ts.sx) + ', ' + cssNum(ts.sy) + ')');
    } else {
      result.push('scale(' + cssNum(ts.sx) + ')');
    }
  }
  if (nonzero(ts.twi)) {
    result.push('rotate(' + cssNum(ts.twi) + 'deg)');
  }
  if (!result.length) {
    return 'none';
  }
  return result.join(' ');
}

function radiansToDegrees(r) {
  var d = r * 180 / Math.PI;
  if (d > 180) { d -= 360; }
  return d;
}

function convertToRadians(d) {
  return d * Math.PI / 180;
}

function normalizeRotation(x) {
  if (Math.abs(x) > 180) {
    x = x % 360;
    if (x > 180) { x -= 360; }
    else if (x <= -180) { x += 360; }
  }
  return x;
}

function normalizeRotationDelta(x) {
  if (Math.abs(x) >= 720) {
    x = x % 360 + (x > 0 ? 360 : -360);
  }
  return x;
}

//////////////////////////////////////////////////////////////////////////
// TURTLE DRAWING SUPPORT
// If pen, fill, or dot are used, then a full-page canvas is created
// and used for drawing.
//////////////////////////////////////////////////////////////////////////

// drawing state.
var drawing = {
  attached: false,
  surface: null,
  field: null,
  ctx: null,
  canvas: null,
  timer: null,
  subpixel: 1
};

function getTurtleField() {
  if (!drawing.field) {
    createSurfaceAndField();
  }
  return drawing.field;
}

function getTurtleClipSurface() {
  if (!drawing.surface) {
    createSurfaceAndField();
  }
  return drawing.surface;

}

function createSurfaceAndField() {
  var surface = document.createElement('samp'),
      field = document.createElement('samp'),
      cw = Math.floor(ww() / 2),
      ch = Math.floor(wh() / 2);
  $(surface)
    .css({
      position: 'absolute',
      display: 'inline-block',
      top: 0, left: 0, width: '100%', height: '100%',
      zIndex: -1,
      font: 'inherit',
      // Setting transform origin for the turtle field
      // fixes a "center" point in page coordinates that
      // will not change even if the document resizes.
      transformOrigin: cw + "px " + ch + "px",
      overflow: 'hidden'
    });
  $(field).attr('id', 'field')
    .css({
      position: 'absolute',
      display: 'inline-block',
      top: ch, left: cw, width: '100%', height: '100%',
      font: 'inherit',
      // Setting transform origin for the turtle field
      // fixes a "center" point in page coordinates that
      // will not change even if the document resizes.
      transformOrigin: "0px 0px",
    }).appendTo(surface);
  drawing.surface = surface;
  drawing.field = field;
  attachClipSurface();
}

function attachClipSurface() {
  if (document.body) {
    $(drawing.surface).prependTo('body');
    // Attach an event handler to forward mouse events from the body
    // to turtles in the turtle field layer.
    $('body').on('click.turtle ' +
      'mouseup.turtle mousedown.turtle mousemove.turtle', function(e) {
      if (e.target === this && !e.isTrigger) {
        // Only forward events directly on the body that (geometrically)
        // touch a turtle directly within the turtlefield.
        var warn = $.turtle.nowarn;
        $.turtle.nowarn = true;
        var sel = $(drawing.surface).find('.turtle').within('touch', e).eq(0);
        $.turtle.nowarn = warn;
        if (sel.length === 1) {
          // Erase portions of the event that are wrong for the turtle.
          e.target = null;
          e.relatedTarget = null;
          e.fromElement = null;
          e.toElement = null;
          sel.trigger(e);
          return false;
        }
      }
    });
  } else {
    $(document).ready(attachClipSurface);
  }
}

function getTurtleDrawingCtx() {
  if (drawing.ctx) {
    return drawing.ctx;
  }
  var surface = getTurtleClipSurface();
  drawing.canvas = document.createElement('canvas');
  $(drawing.canvas).css({'z-index': -1});
  surface.insertBefore(drawing.canvas, surface.firstChild);
  drawing.ctx = drawing.canvas.getContext('2d');
  resizecanvas();
  pollbodysize(resizecanvas);
  $(window).resize(resizecanvas);
  drawing.ctx.scale(drawing.subpixel, drawing.subpixel);
  return drawing.ctx;
}

function getOffscreenCanvas(width, height) {
  if (drawing.offscreen &&
      drawing.offscreen.width === width &&
      drawing.offscreen.height === height) {
    return drawing.offscreen;
  }
  if (!drawing.offscreen) {
    drawing.offscreen = document.createElement('canvas');
  }
  drawing.offscreen.width = width;
  drawing.offscreen.height = height;
  return drawing.offscreen;
}

function pollbodysize(callback) {
  var b = $('body');
  var lastwidth = b.width();
  var lastheight = b.height();
  var poller = (function() {
    if (b.width() != lastwidth || b.height() != lastheight) {
      callback();
      lastwidth = b.width();
      lastheight = b.height();
    }
  });
  if (drawing.timer) {
    clearInterval(drawing.timer);
  }
  drawing.timer = setInterval(poller, 250);
}

function resizecanvas() {
  if (!drawing.canvas) return;
  var b = $('body'),
      wh = Math.max(b.outerHeight(true),
          window.innerHeight || $(window).height()),
      bw = Math.max(200, Math.ceil(b.outerWidth(true) / 100) * 100),
      bh = Math.max(200, Math.ceil(wh / 100) * 100),
      cw = drawing.canvas.width,
      ch = drawing.canvas.height,
      tc;
  $(drawing.surface).css({ width: b.outerWidth(true) + 'px',
      height: wh + 'px'});
  if (cw != bw * drawing.subpixel || ch != bh * drawing.subpixel) {
    // Transfer canvas out to tc and back again after resize.
    tc = document.createElement('canvas');
    tc.width = Math.min(cw, bw * drawing.subpixel);
    tc.height = Math.min(ch, bh * drawing.subpixel);
    tc.getContext('2d').drawImage(drawing.canvas, 0, 0);
    drawing.canvas.width = bw * drawing.subpixel;
    drawing.canvas.height = bh * drawing.subpixel;
    drawing.canvas.getContext('2d').drawImage(tc, 0, 0);
    $(drawing.canvas).css({ width: bw, height: bh });
  }
}

// turtlePenStyle style syntax
function parsePenStyle(text, defaultProp) {
  if (!text) { return null; }
  text = String(text);
  if (text.trim) { text = text.trim(); }
  if (!text || text === 'none') { return null; }
  if (text === 'path' || text === 'fill') {
    return { savePath: true };
  }
  var eraseMode = false;
  if (/^erase\b/.test(text)) {
    text = text.replace(
        /^erase\b/, 'white globalCompositeOperation destination-out');
    eraseMode = true;
  }
  var words = text.split(/\s+/),
      mapping = {
        strokeStyle: identity,
        lineWidth: parseFloat,
        lineCap: identity,
        lineJoin: identity,
        miterLimit: parseFloat,
        fillStyle: identity,
        globalCompositeOperation: identity
      },
      result = {}, j, end = words.length;
  if (eraseMode) { result.eraseMode = true; }
  for (j = words.length - 1; j >= 0; --j) {
    if (mapping.hasOwnProperty(words[j])) {
      var key = words[j],
          param = words.slice(j + 1, end).join(' ');
      result[key] = mapping[key](param);
      end = j;
    }
  }
  if (end > 0 && !result[defaultProp]) {
    result[defaultProp] = words.slice(0, end).join(' ');
  }
  return result;
}

function writePenStyle(style) {
  if (!style) { return 'none'; }
  var result = [];
  $.each(style, function(k, v) {
    result.push(k);
    result.push(v);
  });
  return result.join(' ');
}

function parsePenDown(style) {
  if (style == 'down' || style === true) return true;
  if (style == 'up' || style === false) return false;
  return undefined;
}

function writePenDown(bool) {
  return bool ? 'down' : 'up';
}

function getTurtleData(elem) {
  var state = $.data(elem, 'turtleData');
  if (!state) {
    state = $.data(elem, 'turtleData', {
      style: null,
      path: [[]],
      down: true,
      speed: 'turtle',
      easing: 'swing',
      turningRadius: 0,
      quickpagexy: null
    });
  }
  return state;
}

function getTurningRadius(elem) {
  var state = $.data(elem, 'turtleData');
  if (!state) { return 0; }
  return state.turningRadius;
}

function makeTurningRadiusHook() {
  return {
    get: function(elem, computed, extra) {
      return cssNum(getTurningRadius(elem)) + 'px';
    },
    set: function(elem, value) {
      var radius = parseFloat(value);
      if (isNaN(radius)) return;
      getTurtleData(elem).turningRadius = radius;
      elem.style.turtleTurningRadius = '' + cssNum(radius) + 'px';
      if (radius === 0) {
        // When radius goes to zero, renormalize rotation to
        // between 180 and -180.  (We avoid normalizing rotation
        // when there is a visible turning radius so we can tell
        // the difference between +361 and +1 and -359 arcs,
        // which are all different.)
        var ts = readTurtleTransform(elem, false);
        if (ts && (ts.rot > 180 || ts.rot <= -180)) {
          ts.rot = normalizeRotation(ts.rot);
          elem.style[transform] = writeTurtleTransform(ts);
        }
      }
    }
  };
}

function makePenStyleHook() {
  return {
    get: function(elem, computed, extra) {
      return writePenStyle(getTurtleData(elem).style);
    },
    set: function(elem, value) {
      var style = parsePenStyle(value, 'strokeStyle');
      getTurtleData(elem).style = style;
      elem.style.turtlePenStyle = writePenStyle(style);
      flushPenState(elem);
    }
  };
}

function makePenDownHook() {
  return {
    get: function(elem, computed, extra) {
      return writePenDown(getTurtleData(elem).down);
    },
    set: function(elem, value) {
      var style = parsePenDown(value);
      if (style === undefined) return;
      var state = getTurtleData(elem);
      if (style != state.down) {
        state.down = style;
        state.quickpagexy = null;
        elem.style.turtlePenDown = writePenDown(style);
        flushPenState(elem);
      }
    }
  };
}

function isPointNearby(a, b) {
  return Math.round(a.pageX - b.pageX) === 0 &&
         Math.round(a.pageY - b.pageY) === 0;
}

function isBezierTiny(a, b) {
  return isPointNearby(a, b) &&
         Math.round(a.pageX - b.pageX1) === 0 &&
         Math.round(a.pageY - b.pageY1) === 0 &&
         Math.round(b.pageX2 - b.pageX) === 0 &&
         Math.round(b.pageY2 - b.pageY) === 0;
}

function roundEpsilon(x) {
  var dig3 = x * 1000, tru3 = Math.round(dig3);
  if (Math.abs(tru3 - dig3) < Math.abs(5e-15 * dig3)) {
    return tru3 / 1000;
  }
  return x;
}

function applyPenStyle(ctx, ps, scale) {
  scale = scale || 1;
  var extraWidth = ps.eraseMode ? 1 : 0;
  if (!ps || !('strokeStyle' in ps)) { ctx.strokeStyle = 'black'; }
  if (!ps || !('lineWidth' in ps)) { ctx.lineWidth = 1.62 * scale + extraWidth; }
  if (!ps || !('lineCap' in ps)) { ctx.lineCap = 'round'; }
  if (ps) {
    for (var a in ps) {
      if (a === 'savePath' || a === 'eraseMode') { continue; }
      if (scale && a === 'lineWidth') {
        ctx[a] = scale * ps[a] + extraWidth;
      } else {
        ctx[a] = ps[a];
      }
    }
  }
}

function drawAndClearPath(path, style, scale) {
  var ctx = getTurtleDrawingCtx(),
      isClosed, skipLast,
      j = path.length,
      segment;
  ctx.save();
  ctx.beginPath();
  // Scale up lineWidth by sx.  (TODO: consider parent transforms.)
  applyPenStyle(ctx, style, scale);
  while (j--) {
    if (path[j].length > 1) {
      segment = path[j];
      isClosed = segment.length > 2 && isPointNearby(
          segment[0], segment[segment.length - 1]);
      skipLast = isClosed && (!('pageX2' in segment[segment.length - 1]));
      ctx.moveTo(segment[0].pageX, segment[0].pageY);
      for (var k = 1; k < segment.length - (skipLast ? 1 : 0); ++k) {
        if ('pageX2' in segment[k] &&
            !isBezierTiny(segment[k - 1], segment[k])) {
          ctx.bezierCurveTo(
             segment[k].pageX1, segment[k].pageY1,
             segment[k].pageX2, segment[k].pageY2,
             segment[k].pageX, segment[k].pageY);
        } else {
          ctx.lineTo(segment[k].pageX, segment[k].pageY);
        }
      }
      if (isClosed) { ctx.closePath(); }
    }
  }
  if ('fillStyle' in style) { ctx.fill(); }
  if ('strokeStyle' in style) { ctx.stroke(); }
  ctx.restore();
  path.length = 1;
  path[0].splice(0, path[0].length - 1);
}

function addBezierToPath(path, start, triples) {
  if (!path.length || !isPointNearby(start, path[path.length - 1])) {
    path.push(start);
  }
  for (var j = 0; j < triples.length; ++j) {
    path.push({
        pageX1: triples[j][0].pageX, pageY1: triples[j][0].pageY,
        pageX2: triples[j][1].pageX, pageY2: triples[j][1].pageY,
        pageX: triples[j][2].pageX, pageY: triples[j][2].pageY });
  }
}

function flushPenState(elem) {
  var state = getTurtleData(elem);
  if (!state.style || (!state.down && !state.style.savePath)) {
    if (state.path.length > 1) { state.path.length = 1; }
    if (state.path[0].length) { state.path[0].length = 0; }
    return;
  }
  if (!state.down) {
    // Penup when saving path will start a new segment if one isn't started.
    if (state.path.length && state.path[0].length) {
      state.path.shift([]);
    }
    return;
  }
  var center = getCenterInPageCoordinates(elem);
  if (!state.path[0].length ||
      !isPointNearby(center, state.path[0][state.path[0].length - 1])) {
    state.path[0].push(center);
  }
  if (!state.style.savePath) {
    var ts = readTurtleTransform(elem, true);
    drawAndClearPath(state.path, state.style, ts.sx);
  }
}

function endAndFillPenPath(elem, style) {
  var ts = readTurtleTransform(elem, true),
      state = getTurtleData(elem);
  drawAndClearPath(state.path, style);
  if (state.style && state.style.savePath) {
    $.style(elem, 'turtlePenStyle', 'none');
  }
}

function fillDot(position, diameter, style) {
  var ctx = getTurtleDrawingCtx();
  ctx.save();
  applyPenStyle(ctx, style);
  if (diameter === Infinity && drawing.canvas) {
    ctx.fillRect(0, 0, drawing.canvas.width, drawing.canvas.height);
  } else {
    ctx.beginPath();
    ctx.arc(position.pageX, position.pageY, diameter / 2, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.fill();
    if (style.strokeStyle) {
      ctx.stroke();
    }
  }
  ctx.restore();
}

function clearField(arg) {
  if (!arg || /\bcanvas\b/.test(arg)) {
    eraseBox(document, {fillStyle: 'transparent'});
  }
  if (!arg || /\bturtles\b/.test(arg)) {
    if (drawing.surface) {
      var sel = $(drawing.surface).find('.turtle');
      if (global_turtle) {
        sel = sel.not(global_turtle);
      }
      sel.remove();
    }
  }
  if (!arg || /\btext\b/.test(arg)) {
    var keep = $('samp#_testpanel');
    if (drawing.surface) {
      keep = keep.add(drawing.surface);
    }
    $('body').contents().not(keep).remove();
  }
}

function eraseBox(elem, style) {
  var c = getCornersInPageCoordinates(elem),
      ctx = getTurtleDrawingCtx(),
      j = 1;
  if (!c || c.length < 3) { return; }
  ctx.save();
  // Clip to box and use 'copy' mode so that 'transparent' can be
  // written into the canvas - that's better erasing than 'white'.
  ctx.globalCompositeOperation = 'copy';
  applyPenStyle(ctx, style);
  ctx.beginPath();
  ctx.moveTo(c[0].pageX, c[0].pageY);
  for (; j < c.length; j += 1) {
    ctx.lineTo(c[j].pageX, c[j].pageY);
  }
  ctx.closePath();
  ctx.clip();
  ctx.fill();
  ctx.restore();
}

function getBoundingBoxOfCorners(c, clipToDoc) {
  if (!c || c.length < 1) return null;
  var j = 1, result = {
    left: Math.floor(c[0].pageX),
    top: Math.floor(c[0].pageY),
    right: Math.ceil(c[0].pageX),
    bottom: Math.ceil(c[0].pageY)
  };
  for (; j < c.length; ++j) {
    result.left = Math.min(result.left, Math.floor(c[j].pageX));
    result.top = Math.min(result.top, Math.floor(c[j].pageY));
    result.right = Math.max(result.right, Math.ceil(c[j].pageX));
    result.bottom = Math.max(result.bottom, Math.ceil(c[j].pageY));
  }
  if (clipToDoc) {
    result.left = Math.max(0, result.left);
    result.top = Math.max(0, result.top);
    result.right = Math.min(dw(), result.right);
    result.bottom = Math.min(dh(), result.bottom);
  }
  return result;
}

function touchesPixel(elem, color) {
  if (!elem || !drawing.canvas) { return false; }
  var c = getCornersInPageCoordinates(elem),
      canvas = drawing.canvas,
      bb = getBoundingBoxOfCorners(c, true),
      w = (bb.right - bb.left) * drawing.subpixel,
      h = (bb.bottom - bb.top) * drawing.subpixel,
      osc = getOffscreenCanvas(w, h),
      octx = osc.getContext('2d'),
      rgba = rgbaForColor(color),
      j = 1, k, data;
  if (!c || c.length < 3 || !w || !h) { return false; }
  octx.clearRect(0, 0, w, h);
  octx.drawImage(canvas,
      bb.left * drawing.subpixel, bb.top * drawing.subpixel, w, h, 0, 0, w, h);
  octx.save();
  // Erase everything outside clipping region.
  octx.beginPath();
  octx.moveTo(0, 0);
  octx.lineTo(w, 0);
  octx.lineTo(w, h);
  octx.lineTo(0, h);
  octx.closePath();
  octx.moveTo((c[0].pageX - bb.left) * drawing.subpixel,
              (c[0].pageY - bb.top) * drawing.subpixel);
  for (; j < c.length; j += 1) {
    octx.lineTo((c[j].pageX - bb.left) * drawing.subpixel,
                (c[j].pageY - bb.top) * drawing.subpixel);
  }
  octx.closePath();
  octx.clip();
  octx.clearRect(0, 0, w, h);
  octx.restore();
  // Now examine the results and look for alpha > 0%.
  data = octx.getImageData(0, 0, w, h).data;
  if (!rgba) {
    for (j = 0; j < data.length; j += 4) {
      if (data[j + 3] > 0) return true;
    }
  } else {
    for (j = 0; j < data.length; j += 4) {
      // Look for a near-match in color: within a 7x7x7 cube in rgb space,
      // and at least 50% of the target alpha value.
      if (Math.abs(data[j + 0] - rgba[0]) <= 3 &&
          Math.abs(data[j + 1] - rgba[1]) <= 3 &&
          Math.abs(data[j + 2] - rgba[2]) <= 3 &&
          data[j + 3] <= rgba[3] * 2 && data[j + 3] >= rgba[3] / 2) {
        return true;
      }
    }
  }
  return false;
}

//////////////////////////////////////////////////////////////////////////
// JQUERY METHOD SUPPORT
// Functions in direct support of exported methods.
//////////////////////////////////////////////////////////////////////////

function applyImg(sel, img) {
  if (sel[0].tagName == 'IMG') {
    setImageWithStableOrigin(sel[0], img.url, img.css);
  } else {
    var props = {
      backgroundImage: 'url(' + img.url + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };
    if (img.css.width && img.css.height) {
      props.backgroundSize = img.css.width + 'px ' + img.css.height + 'px';
    }
    sel.css(props);
  }
}

function doQuickMove(elem, distance, sideways) {
  var ts = readTurtleTransform(elem, true),
      r = ts && convertToRadians(ts.rot),
      scaledDistance = ts && (distance * ts.sy),
      scaledSideways = ts && ((sideways || 0) * ts.sy),
      dy = -Math.cos(r) * scaledDistance,
      dx = Math.sin(r) * scaledDistance,
      state = $.data(elem, 'turtleData'),
      qpxy;
  if (!ts) { return; }
  if (sideways) {
    dy += Math.sin(r) * scaledSideways;
    dx += Math.cos(r) * scaledSideways;
  }
  if (state && (qpxy = state.quickpagexy)) {
    state.quickpagexy = {
      pageX: qpxy.pageX + dx,
      pageY: qpxy.pageY + dy
    };
  }
  ts.tx += dx;
  ts.ty += dy;
  elem.style[transform] = writeTurtleTransform(ts);
  flushPenState(elem);
}

function doQuickMoveXY(elem, dx, dy) {
  var ts = readTurtleTransform(elem, true),
      state = $.data(elem, 'turtleData'),
      qpxy;
  if (!ts) { return; }
  if (state && (qpxy = state.quickpagexy)) {
    state.quickpagexy = {
      pageX: qpxy.pageX + dx,
      pageY: qpxy.pageY - dy
    };
  }
  ts.tx += dx;
  ts.ty -= dy;
  elem.style[transform] = writeTurtleTransform(ts);
  flushPenState(elem);
}

function doQuickRotate(elem, degrees) {
  var ts = readTurtleTransform(elem, true);
  if (!ts) { return; }
  ts.rot += degrees;
  elem.style[transform] = writeTurtleTransform(ts);
}

function displacedPosition(elem, distance, sideways) {
  var ts = readTurtleTransform(elem, true),
      r = ts && convertToRadians(ts.rot),
      scaledDistance = ts && (distance * ts.sy),
      scaledSideways = ts && ((sideways || 0) * ts.sy),
      dy = -Math.cos(r) * scaledDistance,
      dx = Math.sin(r) * scaledDistance;
  if (!ts) { return; }
  if (scaledSideways) {
    dy += Math.sin(r) * scaledSideways;
    dx += Math.cos(r) * scaledSideways;
  }
  return cssNum(ts.tx + dx) + ' ' + cssNum(ts.ty + dy);
}

function isPageCoordinate(obj) {
  return obj && $.isNumeric(obj.pageX) && $.isNumeric(obj.pageY);
}

function makeTurtleSpeedHook() {
  return {
    get: function(elem, computed, extra) {
      return getTurtleData(elem).speed;
    },
    set: function(elem, value) {
      if ((!$.isNumeric(value) || value <= 0) &&
          !(value in $.fx.speeds) && ('' + value != 'Infinity')) {
        return;
      }
      getTurtleData(elem).speed = '' + value;
    }
  }
}

function makeTurtleEasingHook() {
  return {
    get: function(elem, computed, extra) {
      return getTurtleData(elem).easing;
    },
    set: function(elem, value) {
      if (!(value in $.easing)) {
        return;
      }
      getTurtleData(elem).easing = value;
    }
  }
}

function animTime(elem) {
  var state = $.data(elem, 'turtleData');
  if (!state) return 'turtle';
  if ($.isNumeric(state.speed) || state.speed == 'Infinity') {
    return 1000 / state.speed;
  }
  return state.speed;
}

function animEasing(elem) {
  var state = $.data(elem, 'turtleData');
  if (!state) return null;
  return state.easing;
}

function makeTurtleForwardHook() {
  return {
    get: function(elem, computed, extra) {
      // TODO: after reading turtleForward, we need to also
      // adjust it if ts.tx/ty change due to an origin change,
      // so that images don't stutter if they resize during an fd.
      // OR - offset by origin, so that changes in its value are
      // not a factor.
      var ts = readTurtleTransform(elem, computed),
          middle = readTransformOrigin(elem);
      if (ts) {
        var r = convertToRadians(ts.rot),
            c = Math.cos(r),
            s = Math.sin(r);
        return cssNum(((ts.tx + middle[0]) * s - (ts.ty + middle[1]) * c)
            / ts.sy) + 'px';
      }
    },
    set: function(elem, value) {
      var ts = readTurtleTransform(elem, true) ||
              {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0},
          middle = readTransformOrigin(elem),
          v = parseFloat(value) * ts.sy,
          r = convertToRadians(ts.rot),
          c = Math.cos(r),
          s = Math.sin(r),
          p = (ts.tx + middle[0]) * c + (ts.ty + middle[1]) * s,
          ntx = p * c + v * s - middle[0],
          nty = p * s - v * c - middle[1],
          state = $.data(elem, 'turtleData'),
          qpxy;
      if (state && (qpxy = state.quickpagexy)) {
        state.quickpagexy = {
          pageX: qpxy.pageX + (ntx - ts.tx),
          pageY: qpxy.pageY + (nty - ts.ty)
        };
      }
      ts.tx = ntx;
      ts.ty = nty;
      elem.style[transform] = writeTurtleTransform(ts);
      flushPenState(elem);
    }
  };
}

// Finally, add turtle support.
function makeTurtleHook(prop, normalize, unit, displace) {
  return {
    get: function(elem, computed, extra) {
      var ts = readTurtleTransform(elem, computed);
      if (ts) { return ts[prop] + unit; }
    },
    set: function(elem, value) {
      var ts = readTurtleTransform(elem, true) ||
          {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0},
          opt = { displace: displace },
          state = $.data(elem, 'turtleData'),
          otx = ts.tx, oty = ts.ty, qpxy;
      ts[prop] = normalize(value, elem, ts, opt);
      elem.style[transform] = writeTurtleTransform(ts);
      if (opt.displace) {
        if (state && (qpxy = state.quickpagexy)) {
          state.quickpagexy = {
            pageX: qpxy.pageX + (ts.tx - otx),
            pageY: qpxy.pageY + (ts.ty - oty)
          };
        }
        flushPenState(elem);
      }
    }
  };
}

function maybeArcRotation(end, elem, ts, opt) {
  end = parseFloat(end);
  var state = $.data(elem, 'turtleData'),
      tradius = state ? state.turningRadius : 0;
  if (tradius === 0) {
    // Avoid drawing a line if zero turning radius.
    opt.displace = false;
    return normalizeRotation(end);
  }
  var tracing = (state && state.style && state.down),
      r0 = ts.rot, r1, r1r, a1r, a2r, j, r, pts, triples,
      r0r = convertToRadians(ts.rot),
      delta = normalizeRotationDelta(end - r0),
      radius = (delta > 0 ? tradius : -tradius) * ts.sy,
      dc = [Math.cos(r0r) * radius, Math.sin(r0r) * radius],
      splits, splita, absang, dx, dy, qpxy,
      path, totalParentTransform, start, relative, points;
  if (tracing) {
    // Decompose an arc into equal arcs, all 45 degrees or less.
    splits = 1;
    splita = delta;
    absang = Math.abs(delta);
    if (absang > 45) {
      splits = Math.ceil(absang / 45);
      splita = delta / splits;
    }
    path = state.path[0];
    totalParentTransform = totalTransform2x2(elem.parentElement);
    // Relative traces out the unit-radius arc centered at the origin.
    relative = [];
    while (--splits >= 0) {
      r1 = splits === 0 ? end : r0 + splita;
      a1r = convertToRadians(r0 + 180);
      a2r = convertToRadians(r1 + 180);
      relative.push.apply(relative, approxBezierUnitArc(a1r, a2r));
      r0 = r1;
    }
    points = [];
    // start is the starting position in absolute coordinates,
    // and dc is the local coordinate offset from the starting
    // position to the center of the turning radius.
    start = getCenterInPageCoordinates(elem);
    for (j = 0; j < relative.length; j++) {
      // Multiply each coordinate by radius scale up to the right
      // turning radius and add to dc to center the turning radius
      // at the right local coordinate position; then apply parent
      // distortions to get page-coordinate relative offsets to the
      // turtle's original position.
      r = matrixVectorProduct(totalParentTransform,
          addVector(scaleVector(relative[j], radius), dc));
      // Finally add these to the turtle's actual original position
      // to get page-coordinate control points for the bezier curves.
      points.push({
        pageX: r[0] + start.pageX,
        pageY: r[1] + start.pageY});
    }
    // Divide control points into triples again to form bezier curves.
    triples = [];
    for (j = 0; j < points.length; j += 3) {
      triples.push(points.slice(j, j + 3));
    }
    addBezierToPath(path, start, triples);
  }
  // Now move turtle to its final position: in local coordinates,
  // translate to the turning center plus the vector to the arc end.
  r1r = convertToRadians(end);
  dx = dc[0] - Math.cos(r1r) * radius;
  dy = dc[1] - Math.sin(r1r) * radius;
  ts.tx += dx;
  ts.ty += dy;
  opt.displace = true;
  return end;
}

function makeRotationStep(prop) {
  return function(fx) {
    if (!fx.delta) {
      fx.delta = normalizeRotationDelta(fx.end - fx.start);
      fx.start = fx.end - fx.delta;
    }
    $.cssHooks[prop].set(fx.elem, fx.start + fx.delta * fx.pos);
  };
}

function splitPair(text, duplicate) {
  if (text.length && text[0] === '_') {
    // Hack: remove forced number non-conversion.
    text = text.substring(1);
  }
  var result = $.map(('' + text).split(/\s+/), parseFloat);
  while (result.length < 2) {
    result.push(duplicate ?
        (!result.length ? 1 : result[result.length - 1]) : 0);
  }
  return result;
}

function makePairStep(prop, displace) {
  return function(fx) {
    if (!fx.delta) {
      var end = splitPair(fx.end, !displace);
      fx.start = splitPair(fx.start, !displace);
      fx.delta = [end[0] - fx.start[0], end[1] - fx.start[1]];
    }
    $.cssHooks[prop].set(fx.elem, [fx.start[0] + fx.delta[0] * fx.pos,
        fx.start[1] + fx.delta[1] * fx.pos].join(' '));
  };
}

var XY = ['X', 'Y'];
function makeTurtleXYHook(publicname, propx, propy, displace) {
  return {
    get: function(elem, computed, extra) {
      var ts = readTurtleTransform(elem, computed);
      if (ts) {
        if (displace || ts[propx] != ts[propy]) {
          // Hack: if asked to convert a pair to a number by fx, then refuse.
          return (extra === '' ? '_' : '') + ts[propx] + ' ' + ts[propy];
        } else {
          return '' + ts[propx];
        }
      }
    },
    set: function(elem, value, extra) {
      var ts = readTurtleTransform(elem, true) ||
              {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0},
          parts = (typeof(value) == 'string' ? value.split(/\s+/) : [value]),
          state = $.data(elem, 'turtleData'),
          otx = ts.tx, oty = ts.ty, qpxy;
      if (parts.length < 1 || parts.length > 2) { return; }
      if (parts.length >= 1) { ts[propx] = parts[0]; }
      if (parts.length >= 2) { ts[propy] = parts[1]; }
      else if (!displace) { ts[propy] = ts[propx]; }
      else { ts[propy] = 0; }
      elem.style[transform] = writeTurtleTransform(ts);
      if (displace) {
        if (state && (qpxy = state.quickpagexy)) {
          state.quickpagexy = {
            pageX: qpxy.pageX + (ts.tx - otx),
            pageY: qpxy.pageY + (ts.ty - oty)
          };
        }
        flushPenState(elem);
      }
    }
  };
}

// A map of url to {img: Image, queue: [{elem: elem, css: css, cb: cb}]}.
var stablyLoadedImages = {};

// setImageWithStableOrigin
//
// Changes the src of an <img> while keeping its transformOrigin
// at the same screen postition (by adjusting the transform).
// Because loading an image from a remote URL is an async operation
// that will move the center of an image at an indeterminate moment,
// this function loads the image in an off-screen objects first, and
// then once the image is loaded, it uses the loaded image to
// determine the natural dimensions; and then it sets these
// dimensions at the same time as setting the <img> src, and
// adjusts the transform according to any change in transformOrigin.
//
// @param elem is the <img> element whose src is to be set.
// @param url is the desried value of the src attribute.
// @param css is a dictionary of css props to set when the image is loaded.
// @param cb is an optional callback, called after the loading is done.
function setImageWithStableOrigin(elem, url, css, cb) {
  var record;
  // The data-loading attr will always reflect the last URL requested.
  elem.setAttribute('data-loading', url);
  if (url in stablyLoadedImages) {
    // Already requested this image?
    record = stablyLoadedImages[url];
    if (record.img.complete) {
      // If already complete, then flip the image right away.
      finishSet(record.img, elem, css, cb);
    } else {
      // If not yet complete, then add the target element to the queue.
      record.queue.push({elem: elem, css: css, cb: cb});
    }
  } else {
    // Set up a new image load.
    stablyLoadedImages[url] = record = {
      img: new Image(),
      queue: [{elem: elem, css: css, cb: cb}]
    };
    // First set up the onload callback, then start loading.
    record.img.addEventListener('load', poll);
    record.img.addEventListener('error', poll);
    record.img.src = url;
    function poll() {
      if (!record.img.complete) {
        // Guard against browsers that may fire onload too early or never.
        setTimeout(poll, 100);
        return;
      }
      record.img.removeEventListener('load', poll);
      record.img.removeEventListener('error', poll);
      // TODO: compute the convex hull of the image.
      var j, queue = record.queue;
      record.queue = null;
      if (queue) {
        // Finish every element that hasn't yet been finished.
        for (j = 0; j < queue.length; ++j) {
          finishSet(record.img, queue[j].elem, queue[j].css, queue[j].cb);
        }
      }
    }
    // Start polling immediatey, because some browser may never fire onload.
    poll();
  }
  // This is the second step, done after the async load is complete:
  // the parameter "loaded" contains the fully loaded Image.
  function finishSet(loaded, elem, css, cb) {
    // Only flip the src if the last requested image is the same as
    // the one we have now finished loading: otherwise, there has been
    // some subsequent load that has now superceded ours.
    if (elem.getAttribute('data-loading') == loaded.src) {
      elem.removeAttribute('data-loading');
      // Read the element's origin before setting the image src.
      var oldOrigin = readTransformOrigin(elem);
      // Set the image to a 1x1 transparent GIF, and clear the transform origin.
      // (This "reset" code was original added in an effort to avoid browser
      // bugs, but it is not clear if it is still needed.)
      elem.src = 'data:image/gif;base64,R0lGODlhAQABAIAAA' +
                 'AAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      var sel = $(elem);
      sel.css({
        backgroundImage: 'none',
        height: '',
        width: '',
        transformOrigin: ''
      });
      // Now set the source, and then apply any css requested.
      sel[0].width = loaded.width;
      sel[0].height = loaded.height;
      sel[0].src = loaded.src;
      if (css) {
        sel.css(css);
      }
      var newOrigin = readTransformOrigin(elem);
      // If there was a change, then translate the element to keep the origin
      // in the same location on the screen.
      if (newOrigin[0] != oldOrigin[0] || newOrigin[1] != oldOrigin[1]) {
        var ts = readTurtleTransform(elem, true);
        ts.tx += oldOrigin[0] - newOrigin[0];
        ts.ty += oldOrigin[1] - newOrigin[1];
        elem.style[transform] = writeTurtleTransform(ts);
      }
    }
    // Call the callback, if any.
    if (cb) {
      cb();
    }
  }
}

function withinOrNot(obj, within, distance, x, y) {
  var sel, elem, gbcr, pos, d2;
  if (x === undefined && y === undefined) {
    sel = $(distance);
    if (!sel.length) { return []; }
    elem = sel[0];
    gbcr = getPageGbcr(elem);
    if (polyMatchesGbcr(getCornersInPageCoordinates(elem), gbcr)) {
      return obj.filter(function() {
        var thisgbcr = getPageGbcr(this);
        return within === (gbcrEncloses(gbcr, thisgbcr) ||
            (!isDisjointGbcr(gbcr, thisgbcr) && $(this).inside(elem)));
      });
    } else {
      return obj.filter(function() {
        return within === $(this).inside(elem);
      });
    }
  }
  if ($.isNumeric(x) && $.isNumeric(y)) {
    pos = [x, y];
  } else {
    pos = x;
  }
  if ($.isArray(pos)) {
    // [x, y]: local coordinates.
    pos = convertLocalXyToPageCoordinates(obj[0] || document.body, [pos])[0];
  }
  if (distance === 'touch') {
    if (isPageCoordinate(pos)) {
      return obj.filter(function() {
        return within === $(this).touches(pos);
      });
    } else {
      sel = $(pos);
      gbcr = getPageGbcr(sel[0]);
      if (polyMatchesGbcr(getCornersInPageCoordinates(sel[0]), gbcr)) {
        return obj.filter(function() {
          var thisgbcr = getPageGbcr(this);
          // !isDisjoint test assumes gbcr is tight.
          return within === (!isDisjointGbcr(gbcr, thisgbcr) &&
            (gbcrEncloses(gbcr, thisgbcr) || sel.touches(this)));
        });
      } else {
        return obj.filter(function() {
          return within === sel.touches(this);
        });
      }
    }
  }
  d2 = distance * distance;
  return obj.filter(function() {
    var gbcr = getPageGbcr(this);
    if (isGbcrOutside(pos, d2, gbcr)) { return !within; }
    if (isGbcrInside(pos, d2, gbcr)) { return within; }
    var thispos = getCenterInPageCoordinates(this),
        dx = pos.pageX - thispos.pageX,
        dy = pos.pageY - thispos.pageY;
    return within === (dx * dx + dy * dy <= d2);
  });
}

//////////////////////////////////////////////////////////////////////////
// JQUERY SUBCLASSING
// Classes to allow jQuery to be subclassed.
//////////////////////////////////////////////////////////////////////////

// A class to wrap jQuery
Pencil = (function(_super) {
  __extends(Pencil, _super);

  function Pencil(selector, context) {
    this.constructor = jQuery;
    this.constructor.prototype = Object.getPrototypeOf(this);
    if ('function' !== typeof selector) {
      jQuery.fn.init.call(this, selector, context, rootjQuery);
    }
  }

  Pencil.prototype.pushStack = function() {
    var count, ret, same;
    ret = jQuery.fn.pushStack.apply(this, arguments);
    count = ret.length;
    same = count === this.length;
    while (same && count--) {
      same = same && this[count] === ret[count];
    }
    if (same) {
      return this;
    } else {
      return ret;
    }
  };

  return Pencil;

})(jQuery.fn.init);

Turtle = (function(_super) {
  __extends(Turtle, _super);

  function Turtle(arg, context) {
    Turtle.__super__.constructor.call(this, hatchone(arg, context));
  }

  return Turtle;

})(Pencil);

//////////////////////////////////////////////////////////////////////////
// JQUERY REGISTRATION
// Register all our hooks.
//////////////////////////////////////////////////////////////////////////

$.extend(true, $, {
  cssHooks: {
    turtlePenStyle: makePenStyleHook(),
    turtlePenDown: makePenDownHook(),
    turtleSpeed: makeTurtleSpeedHook(),
    turtleEasing: makeTurtleEasingHook(),
    turtleForward: makeTurtleForwardHook(),
    turtleTurningRadius: makeTurningRadiusHook(),
    turtlePosition: makeTurtleXYHook('turtlePosition', 'tx', 'ty', true),
    turtlePositionX: makeTurtleHook('tx', identity, 'px', true),
    turtlePositionY: makeTurtleHook('ty', identity, 'px', true),
    turtleRotation: makeTurtleHook('rot', maybeArcRotation, 'deg', true),
    turtleScale: makeTurtleXYHook('turtleScale', 'sx', 'sy', false),
    turtleScaleX: makeTurtleHook('sx', identity, '', false),
    turtleScaleY: makeTurtleHook('sy', identity, '', false),
    turtleTwist: makeTurtleHook('twi', normalizeRotation, 'deg', false),
    turtleHull: makeHullHook()
  },
  cssNumber: {
    turtleRotation: true,
    turtleSpeed: true,
    turtleScale: true,
    turtleScaleX: true,
    turtleScaleY: true,
    turtleTwist: true
  },
  support: {
    turtle: true
  }
});
$.extend(true, $.fx, {
  step: {
    turtlePosition: makePairStep('turtlePosition', true),
    turtleRotation: makeRotationStep('turtleRotation'),
    turtleScale: makePairStep('turtleScale', false),
    turtleTwist: makeRotationStep('turtleTwist')
  },
  speeds: {
    turtle: 0
  }
});

function wraphelp(text, fn) {
  fn.helptext = text;
  return fn;
}

function helpwrite(text) {
  see.html('<aside style="line-height:133%;word-break:normal;' +
           'white-space:normal">' + text + '</aside>');
}
function globalhelp(obj) {
  var helptable = $.extend({}, dollar_turtle_methods, turtlefn, extrahelp),
      helplist, j;
  if (obj && (!$.isArray(obj.helptext))) {
    if (obj in helptable) {
      obj = helptable[obj];
    }
  }
  if (obj && $.isArray(obj.helptext) && obj.helptext.length) {
    for (j = 0; j < obj.helptext.length; ++j) {
      var text = obj.helptext[j];
      helpwrite(text.replace(/<(u)>/g,
          '<$1 style="border:1px solid black;text-decoration:none;' +
          'word-break:keep-all;white-space:nowrap">').replace(/<(mark)>/g,
          '<$1 style="border:1px solid blue;color:blue;text-decoration:none;' +
          'word-break:keep-all;white-space:nowrap;cursor:pointer;" ' +
          'onclick="see.enter($(this).text())">'));
    }
    return helpok;
  }
  if (typeof obj == 'number') {
    helpwrite('Equal to the number ' + obj + '.');
    return helpok;
  }
  if (typeof obj == 'boolean') {
    helpwrite('Equal to the boolean value ' + obj + '.');
    return helpok;
  }
  if (obj === null) {
    helpwrite('The special null value represents the absence of a value.');
    return helpok;
  }
  if (obj === undefined) {
    helpwrite('This is an unassigned value.');
    return helpok;
  }
  if (obj === window) {
    helpwrite('The global window object represents the browser window.');
    return helpok;
  }
  if (obj === document) {
    helpwrite('The HTML document running the program.');
    return helpok;
  }
  if (obj === jQuery) {
    helpwrite('The jQuery function.  Read about it at ' +
        '<a href="http://learn.jquery.com/" target="_blank">jquery.com</a>.');
    return helpok;
  }
  if (obj && obj != globalhelp) {
    helpwrite('No help available for ' + obj);
    return helpok;
  }
  helplist = [];
  for (var name in helptable) {
    if (helptable[name].helptext && helptable[name].helptext.length &&
        (!(name in window) || typeof(window[name]) == 'function')) {
      helplist.push(name);
    }
  }
  helplist.sort(function(a, b) {
    if (a.length != b.length) { return a.length - b.length; }
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  });
  helpwrite("help available for: " + helplist.map(function(x) {
     return '<mark style="border:1px solid blue;color:blue;text-decoration:none;' +
       'word-break:keep-all;white-space:nowrap;cursor:pointer;" ' +
       'onclick="see.enter($(this).text())">' + x + '</mark>';
  }).join(" "));
  return helpok;
}
globalhelp.helptext = [];

function canMoveInstantly(sel) {
  var atime, elem;
  // True if the selector names a single element with no animtation
  // queue and currently moving at speed Infinity.
  return (sel.length == 1 && $.queue(elem = sel[0]).length == 0 &&
        ((atime = animTime(elem)) === 0 || $.fx.speeds[atime] === 0)) && elem;
}

function doNothing() {}

// When using continuation-passing-style (or await-defer), the
// common design pattern is for the last argument of a function
// to be a "continuation" function that is invoked exactly once when
// the aync action requested by the function is completed.  For example,
// the last argument of "lt 90, fn" is a function that is called when
// the turtle has finished animating left by 90 degrees.
// This function returns that last argument if it is a function and
// if the argument list is longer than argcount, or null otherwise.
function continuationArg(args, argcount) {
  argcount = argcount || 0;
  if (args.length <= argcount || typeof(args[args.length - 1]) != 'function') {
    return null;
  }
  return args[args.length - 1];
}

// This function helps implement the continuation-passing-style
// design pattern for turtle animation functions.  It examines the "this"
// jQuery object and the argument list.  If a continuation callback
// function is present, then it returns an object that provides:
//    args: the argument list without the callback function.
//    resolve: a callback function to be called this.length times,
//        as each of the elements' animations completes.  The last time
//        it is called, it will trigger the continuation callback, if any.
//    resolver: same as resolve, but null if there is actually no callback.
//    start: a function to be called once to enable triggering of the callback.
// the last argument in an argument list if it is a function, and if the
// argument list is longer than "argcount" in length.
function setupContinuation(thissel, args, argcount) {
  var done = continuationArg(args, argcount),
      countdown = thissel.length + 1,
      sync = true,
      debugId = debug.nextId();
  if (!done && !debug.attached) {
    return {
      args: args,
      appear: doNothing,
      resolver: null,
      resolve: doNothing,
      start: doNothing
    };
  }
  var rawargs = Array.prototype.slice.call(arguments);
  function resolve() {
    function reportAndDone() {
      debug.reportEvent("resolve", [debugId].concat(rawargs));
      done && done();
    }
    if ((--countdown) == 0) {
      // A subtlety: if we still have not yet finished setting things up
      // when the callback is triggered, it means that we are synchronous
      // to the original call.  For execution-order consistency, we never
      // want to trigger the users' callback synchronously. So we use a
      // timeout in this case.
      if (sync) {
        setTimeout(reportAndDone, 0);
      } else {
        reportAndDone();
      }
    }
  }
  function appear() {
    debug.reportEvent("appear", [debugId].concat(rawargs));
  }
  return {
    args: !done ? args : Array.prototype.slice.call(args, 0, args.length - 1),
    resolver: resolve,
    appear: appear,
    resolve: resolve,
    // Invoked
    start: function start() {
      if (debug.attached) {
        debug.reportEvent("start", [debugId].concat(rawargs));
      }
      resolve();
      sync = false;
    }
  };
}

var turtlefn = {
  rt: wraphelp(
  ["<u>rt(degrees)</u> Right turn. Pivots clockwise by some degrees: " +
      "<mark>rt 90</mark>",
   "<u>rt(degrees, radius)</u> Right arc. Pivots with a turning radius: " +
      "<mark>rt 90, 50</mark>"],
  function rt(degrees, radius) {
    var cc = setupContinuation(this, arguments, 1);
    if (cc.resolver) {
      radius = cc.args[1];
    }
    if (degrees == null) {
      degrees = 90;  // zero-argument default.
    }
    var turtleState = this.captureState();
    var elem;
    if ((elem = canMoveInstantly(this)) &&
        (radius === 0 || (radius == null && getTurningRadius(elem) === 0))) {
      cc.appear(turtleState, 'rt', degrees, radius);
      doQuickRotate(elem, degrees);
      cc.resolve();
      cc.start();
      return this;
    }
    if (radius == null) {
      this.plan(function(j, elem) {
        cc.appear(turtleState, 'rt', degrees, radius);
        this.animate({turtleRotation: '+=' + cssNum(degrees || 0) + 'deg'},
            animTime(elem), animEasing(elem), cc.resolver);
      });
      cc.start();
      return this;
    } else {
      this.plan(function(j, elem) {
        cc.appear(turtleState, 'rt', degrees, radius);
        var oldRadius = this.css('turtleTurningRadius');
        this.css({turtleTurningRadius: (degrees < 0) ? -radius : radius});
        this.animate({turtleRotation: '+=' + cssNum(degrees) + 'deg'},
            animTime(elem), animEasing(elem));
        this.plan(function() {
          this.css({turtleTurningRadius: oldRadius});
          cc.resolve();
        });
      });
      cc.start();
      return this;
    }
  }),
  lt: wraphelp(
  ["<u>lt(degrees)</u> Left turn. Pivots counterclockwise by some degrees: " +
      "<mark>lt 90</mark>",
   "<u>lt(degrees, radius)</u> Left arc. Pivots with a turning radius: " +
      "<mark>lt 90, 50</mark>"],
  function lt(degrees, radius) {
    var cc = setupContinuation(this, arguments, 1);
    if (cc.resolver) {
      radius = cc.args[1];
    }
    if (degrees == null) {
      degrees = 90;  // zero-argument default.
    }
    var turtleState = this.captureState();
    var elem;
    if ((elem = canMoveInstantly(this)) &&
        (radius === 0 || (radius == null && getTurningRadius(elem) === 0))) {
      cc.appear(turtleState, 'lt', degrees, radius);
      doQuickRotate(elem, -degrees);
      cc.resolve();
      cc.start();
      return this;
    }
    if (radius == null) {
      cc.appear(turtleState, 'lt', degrees, radius);
      this.plan(function(j, elem) {
        this.animate({turtleRotation: '-=' + cssNum(degrees || 0) + 'deg'},
            animTime(elem), animEasing(elem), cc.resolver);
      });
      cc.start();
      return this;
    } else {
      this.plan(function(j, elem) {
        cc.appear(turtleState, 'lt', degrees, radius);
        var oldRadius = this.css('turtleTurningRadius');
        this.css({turtleTurningRadius: (degrees < 0) ? -radius : radius});
        this.animate({turtleRotation: '-=' + cssNum(degrees) + 'deg'},
            animTime(elem), animEasing(elem));
        this.plan(function() {
          this.css({turtleTurningRadius: oldRadius});
          cc.resolve();
        });
      });
      cc.start();
      return this;
    }
  }),
  fd: wraphelp(
  ["<u>fd(pixels)</u> Forward. Moves ahead by some pixels: " +
      "<mark>fd 100</mark>"],
  function fd(amount) {
    var cc = setupContinuation(this, arguments, 1);
    if (amount == null) {
      amount = 100;  // zero-argument default.
    }
    var turtleState = this.captureState();
    var elem;
    if ((elem = canMoveInstantly(this))) {
      cc.appear(turtleState, 'fd', amount);
      doQuickMove(elem, amount, 0);
      cc.resolve();
      cc.start();
      return this;
    }
    this.plan(function(j, elem) {
      cc.appear(turtleState, 'fd', amount);
      this.animate({turtleForward: '+=' + cssNum(amount || 0) + 'px'},
          animTime(elem), animEasing(elem), cc.resolver);
    });
    cc.start();
    return this;
  }),
  bk: wraphelp(
  ["<u>bk(pixels)</u> Back. Moves in reverse by some pixels: " +
      "<mark>bk 100</mark>"],
  function bk(amount) {
    var cc = setupContinuation(this, arguments, 1);
    if (amount == null) {
      amount = 100;  // zero-argument default.
    }
    var turtleState = this.captureState();
    var elem;
    if ((elem = canMoveInstantly(this))) {
      cc.appear(turtleState, 'bk', amount);
      doQuickMove(elem, -amount, 0);
      cc.resolve();
      cc.start();
      return this;
    }
    this.plan(function(j, elem) {
      cc.appear(turtleState, 'bk', amount);
      this.animate({turtleForward: '-=' + cssNum(amount || 0) + 'px'},
          animTime(elem), animEasing(elem), cc.resolver);
    });
    cc.start();
    return this;
  }),
  slide: wraphelp(
  ["<u>slide(x, y)</u> Slides right x and forward y pixels without turning: " +
      "<mark>slide 50, 100</mark>"],
  function slide(x, y) {
    var cc = setupContinuation(this, arguments, 1);
    if (cc.resolver) {
      y = cc.args[1];
    }
    if ($.isArray(x)) {
      y = x[1];
      x = x[0];
    }
    if (!y) { y = 0; }
    if (!x) { x = 0; }
    cc.appear(this.captureState(), 'slide', x, y);
    this.plan(function(j, elem) {
      this.animate({turtlePosition: displacedPosition(elem, y, x)},
          animTime(elem), animEasing(elem), cc.resolver);
    });
    cc.start();
    return this;
  }),
  movexy: wraphelp(
  ["<u>movexy(x, y)</u> Changes graphing coordinates by x and y: " +
      "<mark>movexy 50, 100</mark>"],
  function movexy(x, y) {
    var cc = setupContinuation(this, arguments, 2);
    if (cc.resolver) {
      y = cc.args[1];
    }
    if ($.isArray(x)) {
      y = x[1];
      x = x[0];
    }
    if (!y) { y = 0; }
    if (!x) { x = 0; }
    var elem;
    if ((elem = canMoveInstantly(this))) {
      cc.appear();
      doQuickMoveXY(elem, x, y);
      cc.resolve();
      cc.start();
      return this;
    }
    this.plan(function(j, elem) {
      cc.appear();
      var tr = getElementTranslation(elem);
      this.animate(
        { turtlePosition: cssNum(tr[0] + x) + ' ' + cssNum(tr[1] - y) },
        animTime(elem), animEasing(elem), cc.resolver);
    });
    cc.start();
    return this;
  }),
  moveto: wraphelp(
  ["<u>moveto(x, y)</u> Move to graphing coordinates (see <u>getxy</u>): " +
      "<mark>moveto 50, 100</mark>",
   "<u>moveto(obj)</u> Move to page coordinates " +
      "or an object on the page (see <u>pagexy</u>): " +
      "<mark>moveto lastmousemove</mark>"],
  function moveto(x, y) {
    var cc = setupContinuation(this, arguments, 1);
    if (cc.resolver) {
      y = cc.args[1];
    }
    var position = x, localx = 0, localy = 0, limit = null;
    if ($.isNumeric(position) && $.isNumeric(y)) {
      // moveto x, y: use local coordinates.
      localx = parseFloat(position);
      localy = parseFloat(y);
      position = null;
      limit = null;
    } else if ($.isArray(position)) {
      // moveto [x, y], limit: use local coordinates (limit optional).
      localx = position[0];
      localy = position[1];
      position = null;
      limit = y;
    } else if ($.isNumeric(y)) {
      // moveto obj, limit: limited motion in the direction of obj.
      limit = y;
    }
    // Otherwise moveto {pos}, limit: absolute motion with optional limit.
    this.plan(function(j, elem) {
      var pos = position;
      if (pos === null) {
        pos = $(homeContainer(elem)).pagexy();
      }
      if (pos && !isPageCoordinate(pos)) {
        try {
          pos = $(pos).pagexy();
        } catch (e) {
          return;
        }
      }
      if (!pos || !isPageCoordinate(pos)) return;
      if ($.isWindow(elem)) {
        cc.appear();
        scrollWindowToDocumentPosition(pos, limit);
        cc.resolve();
        return;
      } else if (elem.nodeType === 9) {
        return;
      }
      cc.appear();
      this.animate({turtlePosition:
          computeTargetAsTurtlePosition(elem, pos, limit, localx, localy)},
          animTime(elem), animEasing(elem), cc.resolver);
    });
    cc.start();
    return this;
  }),
  jump: wraphelp(
  ["<u>jump(x, y)</u> Move without drawing (compare to <u>slide</u>): " +
      "<mark>jump 0, 50</mark>"],
  function jump(x, y) {
    var cc = setupContinuation(this, arguments, 1);
    this.plan(function(j, elem) {
      var down = this.css('turtlePenDown');
      this.css({turtlePenDown: 'up'});
      this.slide.apply(this, cc.args);
      this.plan(function() {
        this.css({turtlePenDown: down});
        cc.resolve();
      });
    });
    cc.start();
    return this;
  }),
  jumpto: wraphelp(
  ["<u>jumpto(x, y)</u> Move without drawing (compare to <u>moveto</u>): " +
      "<mark>jumpto 50, 100</mark>"],
  function jumpto(x, y) {
    var cc = setupContinuation(this, arguments, 1);
    this.plan(function(j, elem) {
      var down = this.css('turtlePenDown');
      this.css({turtlePenDown: 'up'});
      this.moveto.apply(this, cc.args);
      this.plan(function() {
        this.css({turtlePenDown: down});
        cc.resolve();
      });
    });
    cc.start();
    return this;
  }),
  turnto: wraphelp(
  ["<u>turnto(degrees)</u> Turn to a direction. " +
      "North is 0, East is 90: <mark>turnto 270</turnto>",
   "<u>turnto(x, y)</u> Turn to graphing coordinates: " +
      "<mark>turnto 50, 100</mark>",
   "<u>turnto(obj)</u> Turn to page coordinates or an object on the page: " +
      "<mark>turnto lastmousemove</mark>"],
  function turnto(bearing, y) {
    var cc = setupContinuation(this, arguments, 1);
    if (cc.resolver) {
      y = cc.args[1];
    }
    if ($.isNumeric(y) && $.isNumeric(bearing)) {
      // turnto x, y: convert to turnto [x, y].
      bearing = [bearing, y];
      y = null;
    }
    this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      // turnto bearing: just use the given absolute.
      var limit = null, ts, r, centerpos,
          targetpos = null, nlocalxy = null;
      if ($.isNumeric(bearing)) {
        r = convertToRadians(bearing);
        centerpos = getCenterInPageCoordinates(elem);
        targetpos = {
          pageX: centerpos.pageX + Math.sin(r) * 1024,
          pageY: centerpos.pageY - Math.cos(r) * 1024
        };
        limit = y;
      } else if ($.isArray(bearing)) {
        nlocalxy = computePositionAsLocalOffset(elem);
        nlocalxy[0] -= bearing[0];
        nlocalxy[1] -= bearing[1];
      } else if (isPageCoordinate(bearing)) {
        targetpos = bearing;
      } else {
        try {
          targetpos = $(bearing).pagexy();
        } catch(e) {
          cc.resolve();
          return;
        }
      }
      if (!nlocalxy) {
        nlocalxy = computePositionAsLocalOffset(elem, targetpos);
      }
      dir = radiansToDegrees(Math.atan2(-nlocalxy[0], -nlocalxy[1]));
      ts = readTurtleTransform(elem, true);
      if (!(limit === null)) {
        r = convertToRadians(ts.rot);
        dir = limitRotation(ts.rot, dir, limit === null ? 360 : limit);
      }
      dir = ts.rot + normalizeRotation(dir - ts.rot);
      this.animate({turtleRotation: dir},
          animTime(elem), animEasing(elem), cc.resolver);
    });
    cc.start();
    return this;
  }),
  home: wraphelp(
  ["<u>home()</u> Goes home. " +
      "Jumps to the center without drawing: <mark>do home</mark>"],
  function home(container) {
    var cc = setupContinuation(this, arguments, 0);
    this.plan(function(j, elem) {
      var down = this.css('turtlePenDown'),
          radius = this.css('turtleTurningRadius'),
          hc = container || homeContainer(elem);
      this.css({turtlePenDown: 'up', turtleTurningRadius: 0 });
      this.css({
        turtlePosition:
          computeTargetAsTurtlePosition(
              elem, $(hc).pagexy(), null, 0, 0),
        turtleRotation: 0});
      this.css({turtlePenDown: down, turtleTurningRadius: radius });
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  pen: wraphelp(
  ["<u>pen(color, size)</u> Selects a pen. " +
      "Chooses a color and/or size for the pen: " +
      "<mark>pen red</mark>; <mark>pen 0</mark>; " +
      "<mark>pen erase</mark>; " +
      "<mark>pen blue, 5</mark>.",
   "<u>pen(on-or-off)</u> " +
      "Turns the pen on or off: " +
      "<mark>pen off</mark>; <mark>pen on</mark>."
  ],
  function pen(penstyle, lineWidth) {
    var cc = setupContinuation(this, arguments, 1);
    if (cc.resolver) {
      lineWidth = cc.args[1];
    }
    // SAFF: where?
    var turtleState = this.captureState();
    cc.appear(turtleState, 'pen', penstyle, lineWidth);
    if (penstyle && (typeof(penstyle) == "function") && penstyle.name) {
      // Deal with "tan" and "fill".
      penstyle = penstyle.name;
    }
    if (typeof(penstyle) == "number" && typeof(lineWidth) != "number") {
      // Deal with swapped argument order.
      var swap = penstyle;
      penstyle = lineWidth;
      lineWidth = swap;
    }
    if (lineWidth === 0) {
      penstyle = "none";
    }
    if (penstyle === undefined) {
      penstyle = 'black';
    } else if (penstyle === null) {
      penstyle = 'none';
    }
    this.plan(function(j, elem) {
      cc.appear();
      if (penstyle === false || penstyle === true ||
          penstyle == 'down' || penstyle == 'up') {
        this.css('turtlePenDown', penstyle);
      } else {
        if (lineWidth !== undefined) {
          penstyle += " lineWidth " + lineWidth;
        }
        this.css('turtlePenStyle', penstyle);
      }
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  fill: wraphelp(
  ["<u>fill(color)</u> Fills a path traced using " +
      "<u>pen path</u>: " +
      "<mark>pen path; rt 100, 90; fill blue</mark>"],
  function fill(style) {
    var cc = setupContinuation(this, arguments, 0);
    if (!style) { style = 'black'; }
    var ps = parsePenStyle(style, 'fillStyle');
    this.plan(function(j, elem) {
      endAndFillPenPath(elem, ps);
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  dot: wraphelp(
  ["<u>dot(color, diameter)</u> Draws a dot. " +
      "Color and diameter are optional: " +
      "<mark>dot blue</mark>"],
  function dot(style, diameter) {
    var cc = setupContinuation(this, arguments, 0);
    if (cc.resolver) {
      style = cc.args[0];
      diameter = cc.args[1];
    }
    if ($.isNumeric(style)) {
      // Allow for parameters in either order.
      var t = style;
      style = diameter;
      diameter = t;
    }
    if (diameter == null) { diameter = 8.8; }
    if (!style) { style = 'black'; }
    var ps = parsePenStyle(style, 'fillStyle');
    return this.plan(function(j, elem) {
      var c = this.pagexy(),
          ts = readTurtleTransform(elem, true),
          extraDiam = (ps.eraseMode ? 2 : 0);
      // Scale by sx.  (TODO: consider parent transforms.)
      fillDot(c, diameter * ts.sx + extraDiam, ps);
    });
    cc.start();
    return this;
  }),
  pause: wraphelp(
  ["<u>pause(seconds)</u> Pauses some seconds before proceeding. " +
      "<mark>fd 100; pause 2.5; bk 100</mark>"],
  function pause(seconds) {
    var cc = setupContinuation(this, arguments, 1);
    this.delay(seconds * 1000);
    if (cc.resolver) {
      this.plan(function() {
        cc.resolve();
      });
      cc.start();
    }
    return this;
  }),
  st: wraphelp(
  ["<u>st()</u> Show turtle. The reverse of " +
      "<u>ht()</u>. <mark>do st</mark>"],
  function st() {
    var cc = setupContinuation(this, arguments, 0);
    this.plan(function() {
      this.show();
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  ht: wraphelp(
  ["<u>ht()</u> Hide turtle. The turtle can be shown again with " +
      "<u>st()</u>. <mark>do ht</mark>"],
  function ht() {
    var cc = setupContinuation(this, arguments, 0);
    return this.plan(function() {
      this.hide();
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  pu:
  function pu() {
    return this.pen(false, continuationArg(arguments, 0));
  },
  pd:
  function pd() {
    return this.pen(true, continuationArg(arguments, 0));
  },
  pe:
  function pe() {
    return this.pen('erase', continuationArg(arguments, 0));
  },
  pf:
  function pf() {
    return this.pen('path', continuationArg(arguments, 0));
  },
  play: wraphelp(
  ["<u>play(notes)</u> Play notes. Notes are specified in " +
      "<a href=\"http://abcnotation.com/\" target=\"_blank\">" +
      "ABC notation</a>.  " +
      "<mark>play \"de[dBFA]2[cGEC]4\"</mark>"],
  function play(notes) {
    var cc = setupContinuation(this, arguments, 1);
    this.queue(function() {
      playABC(function() { cc.resolve(); $(this).dequeue(); }, cc.args);
    });
    cc.start();
    return this;
  }),
  speed: wraphelp(
  ["<u>speed(persec)</u> Set one turtle's speed in moves per second: " +
      "<mark>turtle.speed 60</mark>"],
  function speed(mps) {
    var cc = setupContinuation(this, arguments, 1);
    this.plan(function(j, elem) {
      this.css('turtleSpeed', mps);
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  wear: wraphelp(
  ["<u>wear(color)</u> Sets the turtle shell color: " +
      "<mark>wear turquoise</mark>",
      // Deal with "tan" and "fill".
   "<u>wear(url)</u> Sets the turtle image url: " +
      "<mark>wear 'http://bit.ly/1bgrQ0p'</mark>"],
  function wear(name) {
    var cc = setupContinuation(this, arguments, 1);
    var img = nameToImg(name);
    if (!img) return this;
    this.plan(function(j, elem) {
      // Bug workaround - if background isn't cleared early enough,
      // the turtle image doesn't update.  (Even though this is done
      // later in applyImg.)
      this.css({
        backgroundImage: 'none',
      });
      applyImg(this, img);
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  label: wraphelp(
  ["<u>label(text)</u> Labels the current position with HTML: " +
      "<mark>label 'remember'</mark>"],
  function label(html, fn) {
    return this.plan(function() {
      var out = output(html, 'label').css({
        position: 'absolute',
        display: 'table',
        top: 0,
        left: 0
      }).addClass('turtle').appendTo(getTurtleField());
      // Mimic the current position and rotation and scale of the turtle.
      out.css({
        turtlePosition: computeTargetAsTurtlePosition(
            out.get(0), this.pagexy(), null, 0, 0),
        turtleRotation: this.css('turtleRotation'),
        turtleScale: this.css('turtleScale')
      });
      if ($.isFunction(fn)) {
        out.plan(fn);
      }
    });
  }),
  reload: function reload() {
    var cc = setupContinuation(this, arguments, 0);
    // Used to reload images to cycle animated gifs.
    this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) {
        window.location.reload();
        cc.resolve();
        return;
      }
      if (elem.src) {
        var src = elem.src;
        elem.src = '';
        elem.src = src;
      }
      cc.resolve();
    });
    cc.start();
    return this;
  },
  hatch:
  function(count, spec) {
    if (!this.length) return;
    if (spec === undefined && !$.isNumeric(count)) {
      spec = count;
      count = 1;
    }
    // Determine the container in which to hatch the turtle.
    var container = this[0], clone = null;
    if ($.isWindow(container) || container.nodeType === 9) {
      container = getTurtleField();
    } else if (/^(?:br|img|input|hr)$/i.test(container.tagName)) {
      container = container.parentElement;
      clone = this[0];
    }
    // Create the turtle(s)
    if (count === 1) {
      // Pass through identical jquery instance in the 1 case.
      return hatchone(
          typeof spec === 'function' ? spec(0) : spec, container, clone);
    } else {
      var k = 0, result = [];
      for (; k < count; ++k) {
        result.push(hatchone(
            typeof spec === 'function' ? spec(k) : spec, container, clone)[0]);
      }
      return $(result);
    }
  },
  captureState: wraphelp(
  ["<u>captureState()</u> Captures the state of the turtle."],
  function captureState() {
    return {
      pagexy: this.pagexy(),
      pen: this.css('turtlePenStyle'),
      xy: this.getxy(),
      direction: this.direction()
    };
  }),
  pagexy: wraphelp(
  ["<u>pagexy()</u> Page coordinates {pageX:, pageY}, top-left based: " +
      "<mark>c = pagexy(); fd 500; moveto c</mark>"],
  function pagexy() {
    if (!this.length) return;
    var internal = getCenterInPageCoordinates(this[0]);
    return { pageX: internal.pageX, pageY: internal.pageY };
  }),
  getxy: wraphelp(
  ["<u>getxy()</u> Graphing coordinates [x, y], center-based: " +
      "<mark>v = getxy(); slide -v[0], -v[1]</mark>"],
  function getxy() {
    if (!this.length) return;
    return computePositionAsLocalOffset(this[0]);
  }),
  direction: wraphelp(
  ["<u>direction()</u> Current turtle direction. North is 0; East is 90: " +
      "<mark>direction()</mark>",
   "<u>direction(obj)</u> <u>direction(x, y)</u> Returns the direction " +
      "from the turtle towards an object or coordinate. " +
      "Also see <u>turnto</u>: " +
      "<mark>direction lastclick</mark>"],
  function direction(x, y) {
    if (!this.length) return;
    var elem = this[0], pos = x, dir, cur;
    if (pos !== undefined) {
      cur = $(elem).pagexy();
      if ($.isNumeric(y) && $.isNumeric(x)) { pos = [x, y]; }
      if ($.isArray(pos)) {
        pos = convertLocalXyToPageCoordinates(elem, [pos])[0];
      }
      if (!isPageCoordinate(pos)) {
        try { pos = $(pos).pagexy(); }
        catch(e) { }
      }
      if (!pos) { return NaN; }
      return radiansToDegrees(
          Math.atan2(pos.pageX - cur.pageX, cur.pageY - pos.pageY));
    }
    if ($.isWindow(elem) || elem.nodeType === 9) return 0;
    return getDirectionOnPage(elem);
  }),
  distance: wraphelp(
  ["<u>distance(obj)</u> Returns the distance from the turtle to " +
      "another object: <mark>distance lastclick</mark>",
   "<u>distance(x, y)</u> Returns the distance from the turtle to " +
      "graphing coorindates: <mark>distance(100, 0)</mark>"],
  function distance(pos, y) {
    if (!this.length) return;
    var elem = this[0], dx, dy, cur = $(elem).pagexy();
    if ($.isNumeric(y) && $.isNumeric(pos)) { pos = [pos, y]; }
    if ($.isArray(pos)) {
      pos = convertLocalXyToPageCoordinates(elem, [pos])[0];
    }
    if (!isPageCoordinate(pos)) {
      try { pos = $(pos).pagexy(); }
      catch(e) { }
    }
    if (!pos) { return NaN; }
    dx = pos.pageX - cur.pageX;
    dy = pos.pageY - cur.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }),
  mirror: function mirror(val) {
    if (val === undefined) {
      // Zero arguments returns true if mirrored.
      var c = $.map(this.css('turtleScale').split(' '), parseFloat),
          p = c[0] * (c.length > 1 ? c[1] : c[0]);
      return (p < 0);
    }
    var cc = setupContinuation(this, arguments, 1);
    this.plan(function(j, elem) {
      var c = $.map($.css(elem, 'turtleScale').split(' '), parseFloat);
      if (c.length === 1) { c.push(c[0]); }
      if ((c[0] * c[1] < 0) === (!val)) {
        c[0] = -c[0];
        this.css('turtleScale', c.join(' '));
      }
      cc.resolve();
    });
    cc.start();
    return this;
  },
  twist: wraphelp(
  ["<u>twist(degrees)</u> Set the primary direction of the turtle. Allows " +
      "use of images that face a different direction than 'up': " +
      "<mark>twist(90)</mark>"],
  function twist(val) {
    if (val === undefined) {
      return parseFloat(this.css('turtleTwist'));
    }
    var cc = setupContinuation(this, arguments, 1);
    this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      this.css('turtleTwist', val);
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  scale: wraphelp(
  ["<u>scale(factor)</u> Scales all motion up or down by a factor. " +
      "To double all drawing: <mark>scale(2)</mark>"],
  function scale(valx, valy) {
    var cc = setupContinuation(this, arguments, 1);
    if (valy === undefined) { valy = valx; }
    // Disallow scaling to zero using this method.
    if (!valx || !valy) { valx = valy = 1; }
    this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      var c = $.map($.css(elem, 'turtleScale').split(' '), parseFloat);
      if (c.length === 1) { c.push(c[0]); }
      c[0] *= valx;
      c[1] *= valy;
      this.css('turtleScale', $.map(c, cssNum).join(' '));
      cc.resolve();
    });
    cc.start();
    return this;
  }),
  cell: wraphelp(
  ["<u>cell(r, c)</u> Row r and column c in a table. " +
      "Use together with the table function: " +
      "<mark>g = table 8, 8; g.cell(0,2).text 'hello'</mark>"],
  function cell(r, c) {
    var sel = this.find(
        $.isNumeric(r) ? 'tr:nth-of-type(' + (r + 1) + ')' : 'tr');
    return sel.find(
        $.isNumeric(c) ? 'td:nth-of-type(' + (c + 1) + ')' : 'td');
  }),
  shown: wraphelp(
  ["<u>shown()</u> True if turtle is shown, false if hidden: " +
      "<mark>do ht; write shown()</mark>"],
  function shown() {
    checkPredicate('shown', this);
    return this.is(':visible');
  }),
  hidden: wraphelp(
  ["<u>hidden()</u> True if turtle is hidden: " +
      "<mark>do ht; write hidden()</mark>"],
  function hidden() {
    checkPredicate('hidden', this);
    return !this.is(':visible');
  }),
  inside: wraphelp(
  ["<u>inside(obj)</u> True if the turtle is encircled by obj: " +
      "<mark>inside(window)</mark>"],
  function inside(elem) {
    checkPredicate('inside', this);
    if (!elem) return false;
    if (typeof elem == 'string') {
      elem = $(elem);
    }
    if (elem.jquery) {
      if (!elem.length || !elem.is(':visible')) return false;
      elem = elem[0];
    }
    var gbcr0 = getPageGbcr(elem),
        encloser = null, rectenc = false,
        allok = true, j = 0, k, obj;
    for (; allok && j < this.length; ++j) {
      obj = this[j];
      // Optimize the outside-bounding-box case.
      if (isDisjointGbcr(gbcr0, getPageGbcr(obj))) {
        return false;
      }
      if (!encloser) {
        encloser = getCornersInPageCoordinates(elem);
        rectenc = polyMatchesGbcr(encloser, gbcr0);
      }
      // Optimize the rectilinear-encloser case.
      if (rectenc && gbcrEncloses(gbcr0, getPageGbcr(obj))) {
        continue;
      }
      if (isPageCoordinate(obj)) {
        allok &= pointInConvexPolygon(obj, encloser);
      } else {
        allok &= doesConvexPolygonContain(
          encloser, getCornersInPageCoordinates(obj));
      }
    }
    return !!allok;
  }),
  touches: wraphelp(
  ["<u>touches(obj)</u> True if the turtle touches obj: " +
      "<mark>touches(lastclick)</mark>",
   "<u>touches(color)</u> True if the turtle touches a drawn color: " +
      "<mark>touches red</mark>"],
  function touches(arg, y) {
    checkPredicate('touches', this);
    if (!this.is(':visible') || !this.length) { return false; }
    if (arg == 'color' || isCSSColor(arg)) {
      return touchesPixel(this[0], arg == 'color' ? null : arg);
    }
    if ($.isNumeric(arg) && $.isNumeric(y)) {
      arg = [arg, y];
    }
    if ($.isArray(arg) && arg.length == 2 &&
        $.isNumeric(arg[0]) && $.isNumeric(arg[1])) {
      arg = convertLocalXyToPageCoordinates(this[0] || document.body, [arg])[0];
    }
    if (!arg) return false;
    if (typeof arg === 'string') { arg = $(arg); }
    if (!arg.jquery && !$.isArray(arg)) { arg = [arg]; }
    var anyok = false, k = 0, j, obj, elem, gbcr0, toucher;
    for (;!anyok && k < this.length; ++k) {
      elem = this[k];
      gbcr0 = getPageGbcr(elem);
      toucher = null;
      for (j = 0; !anyok && j < arg.length; ++j) {
        obj = arg[j];
        // Optimize the outside-bounding-box case.
        if (isDisjointGbcr(gbcr0, getPageGbcr(obj))) {
          continue;
        }
        if (!toucher) {
          toucher = getCornersInPageCoordinates(elem);
        }
        if (isPageCoordinate(obj)) {
          anyok |= pointInConvexPolygon(obj, toucher);
        } else {
          anyok |= doConvexPolygonsOverlap(
            toucher, getCornersInPageCoordinates(obj));
        }
      }
    }
    return !!anyok;
  }),
  within: function within(distance, x, y) {
    checkPredicate('within', this);
    return withinOrNot(this, true, distance, x, y);
  },
  notwithin: function notwithin(distance, x, y) {
    checkPredicate('notwithin', this);
    return withinOrNot(this, false, distance, x, y);
  },
  nearest: function nearest(x, y) {
    var pos, result = [], mind2 = Infinity, gbcr, j;
    if ($.isNumeric(pos) && $.isNumeric(y)) {
      pos = [x, y];
    } else {
      pos = x;
    }
    if ($.isArray(pos)) {
      // [x, y]: local coordinates.
      pos = convertLocalXyToPageCoordinates(this[0] || document.body, [pos])[0];
    }
    if (!isPageCoordinate(pos)) {
      try { pos = $(pos).pagexy(); }
      catch(e) { pos = null; }
    }
    for (j = 0; j < this.length; j++) {
      gbcr = getPageGbcr(this[j]);
      if (!result.length || !isGbcrOutside(pos, mind2, gbcr)) {
        var thispos = getCenterInPageCoordinates(this[j]),
            dx = pos.pageX - thispos.pageX,
            dy = pos.pageY - thispos.pageY,
            d2 = dx * dx + dy * dy;
        if (d2 <= mind2) {
          if (d2 < mind2) {
            mind2 = d2;
            result.length = 0;
          }
          result.push(this[j]);
        }
      }
    }
    return $(result);
  },
  done: wraphelp(
  ["<u>done(fn)</u> Calls fn when animation is complete. Use with await: " +
      "<mark>await done defer()</mark>"],
  function done(callback) {
    var sync = this;
    return this.promise().done(function() {
      if (sync) {
        // Never do callback synchronously.  Instead redo the promise
        // callback after a zero setTimeout.
        var async = sync;
        setTimeout(function() { async.promise().done(callback); }, 0);
      } else {
        callback.apply(this, arguments);
      }
    });
    sync = null;
  }),
  plan: wraphelp(
  ["<u>plan(fn)</u> Runs fn in the animation queue. For planning logic: " +
      "<mark>write getxy(); fd 50; plan -> write getxy(); bk 50"],
  function plan(qname, callback, args) {
    if ($.isFunction(qname)) {
      args = callback;
      callback = qname;
      qname = 'fx';
    }
    // If animation is active, then direct will queue the callback.
    // It will also arrange things so that if the callback enqueues
    // further animations, they are inserted at the same location,
    // so that the callback can expand into several animations,
    // just as an ordinary function call expands into its subcalls.
    function enqueue(elem, index, elemqueue) {
      var action = (args ?
            (function() { callback.apply($(elem), args); }) :
            (function() { callback.call($(elem), index, elem); })),
          lastanim = elemqueue.length && elemqueue[elemqueue.length - 1],
          animation = (function() {
          var saved = $.queue(this, qname),
              subst = [], inserted;
          if (saved[0] === 'inprogress') {
            subst.unshift(saved.shift());
          }
          $.queue(elem, qname, subst);
          action();
          // The Array.prototype.push is faster.
          // $.merge($.queue(elem, qname), saved);
          Array.prototype.push.apply($.queue(elem, qname), saved);
          if (global_plan_counter++ % 64) {
            $.dequeue(elem, qname);
          } else {
            // Insert a timeout after executing a batch of plans,
            // to avoid deep recursion.
            setTimeout(function() { $.dequeue(elem, qname); }, 0);
          }
        });
      animation.finish = action;
      $.queue(elem, qname, animation);
    }
    var elem, sel, length = this.length, j = 0;
    for (; j < length; ++j) {
      elem = this[j];
      // Queue an animation if there is a queue.
      var elemqueue = $.queue(elem, qname);
      if (elemqueue.length) {
        enqueue(elem, j, elemqueue);
      } else if (args) {
        callback.apply($(elem), args);
      } else {
        callback.call($(elem), j, elem);
      }
    }
    return this;
  })
};

// It is unreasonable (and a common error) to queue up motions to try to
// change the value of a predicate.  The problem is that queuing will not
// do anything immediately.  This check prints a warning and flushes the
// queue when the queue is 100 long.
function checkPredicate(fname, sel) {
  if ($.turtle.nowarn) return;
  var ok = true, j;
  for (j = 0; ok && j < sel.length; ++j) {
    if ($.queue(sel[j]).length >= 100) {
      ok = false;
    }
  }
  if (!ok) {
    if (see.visible()) {
      see.html('<span style="color:red">Warning: ' + fname +
      ' may not return useful results when motion is queued. ' +
      'Try <b style="background:yellow">defaultspeed Infinity</b></span>.');
    } else {
      console.warn(fname + ' may not return useful results when motion ' +
      'is queued.  Try defaultspeed Infinity.');
    }
    sel.finish();
  }
}

// LEGACY NAMES
deprecation_shown = {}

function deprecate(map, oldname, newname) {
  map[oldname] = function() {
    if (!(oldname in deprecation_shown)) {
      see.html('<span style="color:red;">' + oldname + ' deprecated.  Use ' +
          newname + '.</span>');
      deprecation_shown[oldname] = 1;
    }
    // map[oldname] = map[newname];
    return map[newname].apply(this, arguments);
  }
}
deprecate(turtlefn, 'direct', 'plan');
deprecate(turtlefn, 'enclosedby', 'inside');
deprecate(turtlefn, 'bearing', 'direction');

$.fn.extend(turtlefn);

//////////////////////////////////////////////////////////////////////////
// TURTLE GLOBAL ENVIRONMENT
// Implements educational support when $.turtle() is called:
// * Looks for an element #id to use as the turtle (id defaults to 'turtle').
// * If not found, does a hatch(id).
// * Turns every #id into a global variable.
// * Sets up globals for "lastclick", "lastmousemove" etc.
// * Sets up global functions for all turtle functions for the main turtle.
// * Sets up a global "tick" function.
// * Sets up a global "speed" function and does a speed(10) by default.
// * Sets up a global "hatch" function to make a new turtle.
//////////////////////////////////////////////////////////////////////////

var turtleGIFUrl = "data:image/gif;base64,R0lGODlhKAAwAPIFAAAAAAFsOACSRTCuSICAgP///wAAAAAAACH5BAlkAAYAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAKAAwAAAD72i6zATEgBCAebHpzUnxhDAMAvhxKOoV3ziuZyo3RO26dTbvgXj/gsCO9ysOhENZz+gKJmcUkmA6PSKfSqrWieVtuU+KGNXbXofLEZgR/VHCgdua4isGz9mbmM6U7/94BmlyfUZ1fhqDhYuGgYqMkCOBgo+RfWsNlZZ3ewIpcZaIYaF6XaCkR6aokqqrk0qrqVinpK+fsbZkuK2ouRy0ob4bwJbCibthh6GYebGcY7/EsWqTbdNG1dd9jnXPyk2d38y0Z9Yub2yA6AvWPYk+zEnkv6xdCoPuw/X2gLqy9vJIGAN4b8pAgpQOIlzI8EkCACH5BAlkAAYALAAAAAAoADAAAAPuaLrMBMSAEIB5senNSfGEMAwC+HEo6hXfOK5nKjdE7bp1Nu+BeP+CwI73Kw6EQ1nP6AomZxSSYDo9Ip9KqtaJ5W25Xej3qqGYsdEfZbMcgZXtYpActzLMeLOP6c7f3nVNfEZ7TXSFg4lyZAYBio+LZYiQfHMbc3iTlG9ilGpdjp4ujESiI6RQpqegqkesqqhKrbEpoaa0KLaiuBy6nrxss6+3w7tomo+cDXmBnsoLza2nsb7SN2tl1nyozVOZTJhxysxnd9XYCrrAtT7KQaPruavBo2HQ8xrvffaN+GV5/JbE45fOG8Ek5Q4qXHgwAQA7"

var eventfn = { click:1, mouseup:1, mousedown:1, mousemove:1,
    keydown:1, keypress:1, keyup:1 };

var global_turtle = null;
var global_turtle_methods = [];
var attaching_ids = false;
var dollar_turtle_methods = {
  cs: wraphelp(
  ["<u>cs()</u> Clear screen. Erases both graphics canvas and " +
      "body text: <mark>do cs</mark>"],
  function cs() {
    var cc = setupContinuation(this, arguments, 0);
    planIfGlobal(function() { clearField(); cc.resolve(); });
  }),
  cg: wraphelp(
  ["<u>cg()</u> Clear graphics. Does not alter body text: " +
      "<mark>do cg</mark>"],
  function cg() {
    var cc = setupContinuation(this, arguments, 0);
    planIfGlobal(function() {clearField('canvas turtles'); cc.resolve(); });
  }),
  ct: wraphelp(
  ["<u>ct()</u> Clear text. Does not alter graphics canvas: " +
      "<mark>do ct</mark>"],
  function ct() {
    var cc = setupContinuation(this, arguments, 0);
    planIfGlobal(function() { clearField('text'); cc.resolve(); });
  }),
  tick: wraphelp(
  ["<u>tick(fps, fn)</u> Calls fn fps times per second until " +
      "<u>tick</u> is called again: " +
      "<mark>c = 10; tick 1, -> c and write(c--) or tick()</mark>"],
  function tick(tps, fn) {
    planIfGlobal(function() { globaltick(tps, fn); });
  }),
  speed: wraphelp(
  ["<u>speed(mps)</u> Sets default turtle speed in moves per second: " +
      "<mark>speed Infinity</mark>"],
  function globalspeed(mps) {
    var cc = setupContinuation(this, arguments, 0);
    planIfGlobal(function() { globaldefaultspeed(mps); cc.resolve(); });
  }),
  play: wraphelp(
  ["<u>play(notes)</u> Play notes. Notes are specified in " +
      "<a href=\"http://abcnotation.com/\" target=\"_blank\">" +
      "ABC notation</a>.  " +
      "<mark>play \"de[dBFA]2[cGEC]4\"</mark>"],
  function play() {
    if (global_turtle) {
      var sel = $(global_turtle);
      sel.play.apply(sel, arguments);
    } else {
      var cc = setupContinuation(this, arguments, 0);
      playABC(function() { cc.resolve(); }, arguments);
    }
  }),
  done: wraphelp(
  ["<u>done(fn)</u> Calls fn when animation is complete. Use with await: " +
      "<mark>await done defer()</mark>"],
  function done(callback) {
    var sync = $('.turtle');
    return sync.promise().done(function() {
      if (sync) {
        // Never do callback synchronously.  Instead redo the promise
        // callback after a zero setTimeout.
        var async = sync;
        setTimeout(function() { async.promise().done(callback); }, 0);
      } else {
        callback.apply(this, arguments);
      }
    });
    sync = null;
  }),
  append: wraphelp(
  ["<u>append(html)</u> Appends text to the document without a new line. " +
      "<mark>append 'try this twice...'</mark>"],
  function append(html) {
    $.fn.append.apply($('body'), arguments);
  }),
  write: wraphelp(
  ["<u>write(html)</u> Writes a line of text. Arbitrary HTML may be written: " +
      "<mark>write 'Hello, world!'</mark>"],
  function write(html) {
    return output(Array.prototype.join.call(arguments, ' '), 'div');
  }),
  read: wraphelp(
  ["<u>read(fn)</u> Reads text or numeric input. " +
      "Calls fn once: " +
      "<mark>read (x) -> write x</mark>",
   "<u>read(html, fn)</u> Prompts for input: " +
      "<mark>read 'Your name?', (v) -> write 'Hello ' + v</mark>"],
  function read(a, b) { return input(a, b, 0); }),
  readnum: wraphelp(
  ["<u>readnum(html, fn)</u> Reads numeric input. Only numbers allowed: " +
      "<mark>readnum 'Amount?', (v) -> write 'Tip: ' + (0.15 * v)</mark>"],
  function readnum(a, b) { return input(a, b, 1); }),
  readstr: wraphelp(
  ["<u>readstr(html, fn)</u> Reads text input. Never " +
      "converts input to a number: " +
      "<mark>readstr 'Enter code', (v) -> write v.length + ' long'</mark>"],
  function readstr(a, b) { return input(a, b, -1); }),
  random: wraphelp(
  ["<u>random(n)</u> Random non-negative integer less than n: " +
      "<mark>write random 10</mark>",
   "<u>random(list)</u> Random member of the list: " +
      "<mark>write random ['a', 'b', 'c']</mark>",
   "<u>random('position')</u> Random page position: " +
      "<mark>moveto random 'position'</mark>",
   "<u>random('color')</u> Random color: " +
      "<mark>pen random 'color'</mark>"],
  random),
  hatch:
  function hatch(count, spec) {
    return $(document).hatch(count, spec);
  },
  button: wraphelp(
  ["<u>button(text, fn)</u> Writes a button. Calls " +
      "fn whenever the button is clicked: " +
      "<mark>button 'GO', -> fd 100</mark>"],
  button),
  table: wraphelp(
  ["<u>table(m, n)</u> Writes m rows and c columns. " +
      "Access cells using <u>cell</u>: " +
      "<mark>g = table 8, 8; g.cell(2,3).text 'hello'</mark>",
   "<u>table(array)</u> Writes tabular data. " +
      "Each nested array is a row: " +
      "<mark>table [[1,2,3],[4,5,6]]</mark>"],
  table),
  rgb: wraphelp(
  ["<u>rgb(r,g,b)</u> Makes a color out of red, green, and blue parts. " +
      "<mark>pen rgb(150,88,255)</mark>"],
  function(r, g, b) { return componentColor('rgb', [
      Math.max(0, Math.min(255, Math.floor(r))),
      Math.max(0, Math.min(255, Math.floor(g))),
      Math.max(0, Math.min(255, Math.floor(b))) ]); }),
  rgba: wraphelp(
  ["<u>rgba(r,g,b,a)</u> Makes a color out of red, green, blue, and alpha. " +
      "<mark>pen rgba(150,88,255,0.5)</mark>"],
  function(r, g, b) { return componentColor('rgba', [
      Math.max(0, Math.min(255, Math.floor(r))),
      Math.max(0, Math.min(255, Math.floor(g))),
      Math.max(0, Math.min(255, Math.floor(b))),
      a ]); }),
  hsl: wraphelp(
  ["<u>hsl(h,s,l)</u> Makes a color out of hue, saturation, and lightness. " +
      "<mark>pen hsl(120,0.65,0.75)</mark>"],
  function(h, s, l) { return componentColor('hsl', [
     h,
     (s * 100).toFixed(0) + '%',
     (l * 100).toFixed() + '%']); }),
  hsla: wraphelp(
  ["<u>hsla(h,s,l,a)</u> Makes a color out of hue, saturation, lightness, " +
      "alpha. <mark>pen hsla(120,0.65,0.75,0.5)</mark>"],
  function(h, s, l, a) { return componentColor('hsl', [
     h,
     (s * 100).toFixed(0) + '%',
     (l * 100).toFixed(0) + '%',
     a]); }),
  click: wraphelp(
  ["<u>click(fn)</u> Calls fn(event) whenever the mouse is clicked. " +
      "<mark>click (e) -> moveto e; label 'clicked'</mark>"],
  function(fn) {
    $(window).click(fn);
  }),
  mouseup: wraphelp(
  ["<u>mouseup(fn)</u> Calls fn(event) whenever the mouse is released. " +
      "<mark>mouseup (e) -> moveto e; label 'up'</mark>"],
  function(fn) {
    $(window).mouseup(fn);
  }),
  mousedown: wraphelp(
  ["<u>mousedown(fn)</u> Calls fn(event) whenever the mouse is pressed. " +
      "<mark>mousedown (e) -> moveto e; label 'down'</mark>"],
  function(fn) {
    $(window).mousedown(fn);
  }),
  mousemove: wraphelp(
  ["<u>mousedown(fn)</u> Calls fn(event) whenever the mouse is moved. " +
      "<mark>mousemove (e) -> moveto e</mark>"],
  function(fn) {
    $(window).mousemove(fn);
  }),
  keydown: wraphelp(
  ["<u>keydown(fn)</u> Calls fn(event) whenever a key is pushed down. " +
      "<mark>keydown (e) -> write 'down ' + e.which</mark>"],
  function(fn) {
    $(window).keydown(fn);
  }),
  keyup: wraphelp(
  ["<u>keyup(fn)</u> Calls fn(event) whenever a key is released. " +
      "<mark>keyup (e) -> write 'up ' + e.which</mark>"],
  function(fn) {
    $(window).keyup(fn);
  }),
  keypress: wraphelp(
  ["<u>keypress(fn)</u> Calls fn(event) whenever a letter is typed. " +
      "<mark>keypress (e) -> write 'press ' + e.which</mark>"],
  function(fn) {
    $(window).keypress(fn);
  }),
  send: wraphelp(
  ["<u>send(name)</u> Sends a message to be received by recv. " +
      "<mark>send 'go'; recv 'go', -> fd 100</mark>"],
  function send(name) {
    var args = arguments;
    var message = Array.prototype.slice.call(args, 1),
        sq = sendRecvData.sent[name];
    if (!sq) { sq = sendRecvData.sent[name] = []; }
    sq.push(message);
    pollSendRecv(name);
  }),
  recv: wraphelp(
  ["<u>recv(name, fn)</u> Calls fn once when a sent message is received. " +
      "<mark>recv 'go', (-> fd 100); send 'go'</mark>"],
  function recv(name, cb) {
    var wq = sendRecvData.waiting[name];
    if (!wq) { wq = sendRecvData.waiting[name] = []; }
    wq.push(cb);
    pollSendRecv(name);
  }),
  abs: wraphelp(
  ["<u>abs(x)</u> The absolute value of x. " +
      "<mark>see abs -5</mark>"], Math.abs),
  acos: wraphelp(
  ["<u>acos(degreees)</u> Trigonometric arccosine, in degrees. " +
      "<mark>see acos 0.5</mark>"],
  function acos(x) { return roundEpsilon(Math.acos(x) * 180 / Math.PI); }
  ),
  asin: wraphelp(
  ["<u>asin(degreees)</u> Trigonometric arcsine, in degrees. " +
      "<mark>see asin 0.5</mark>"],
  function asin(x) { return roundEpsilon(Math.asin(x) * 180 / Math.PI); }
  ),
  atan: wraphelp(
  ["<u>atan(degreees)</u> Trigonometric arctangent, in degrees. " +
      "<mark>see atan 0.5</mark>"],
  function atan(x) { return roundEpsilon(Math.atan(x) * 180 / Math.PI); }
  ),
  atan2: wraphelp(
  ["<u>atan2(degreees)</u> Trigonometric two-argument arctangent, in degrees. " +
      "<mark>see atan -1, 0</mark>"],
  function atan2(x, y) {
    return roundEpsilon(Math.atan2(x, y) * 180 / Math.PI);
  }),
  cos: wraphelp(
  ["<u>cos(degreees)</u> Trigonometric cosine, in degrees. " +
      "<mark>see cos 45</mark>"],
  function cos(x) { return roundEpsilon(Math.cos((x % 360) * Math.PI / 180)); }
  ),
  sin: wraphelp(
  ["<u>sin(degreees)</u> Trigonometric sine, in degrees. " +
      "<mark>see sin 45</mark>"],
  function sin(x) { return roundEpsilon(Math.sin((x % 360) * Math.PI / 180)); }
  ),
  tan: wraphelp(
  ["<u>tan(degreees)</u> Trigonometric tangent, in degrees. " +
      "<mark>see tan 45</mark>"],
  function tan(x) { return roundEpsilon(Math.tan((x % 360) * Math.PI / 180)); }
  ),
  ceil: wraphelp(
  ["<u>ceil(x)</u> Round up. " +
      "<mark>see ceil 1.9</mark>"], Math.ceil),
  floor: wraphelp(
  ["<u>floor(x)</u> Round down. " +
      "<mark>see floor 1.9</mark>"], Math.floor),
  round: wraphelp(
  ["<u>round(x)</u> Round to the nearest integer. " +
      "<mark>see round 1.9</mark>"], Math.round),
  exp: wraphelp(
  ["<u>exp(x)</u> Raise e to the power x. " +
      "<mark>see exp 2</mark>"], Math.exp),
  ln: wraphelp(
  ["<u>ln(x)</u> The natural logarithm of x. " +
      "<mark>see ln 2</mark>"], Math.log),
  log10: wraphelp(
  ["<u>log10(x)</u> The base 10 logarithm of x. " +
      "<mark>see log10 0.01</mark>"],
  function log10(x) { return roundEpsilon(Math.log(x) * Math.LOG10E); }),
  pow: wraphelp(
  ["<u>pow(x, y)</u> Raise x to the power y. " +
      "<mark>see pow 4, 1.5</mark>"],
  function pow(x, y) { return roundEpsilon(Math.pow(x, y)); }),
  sqrt: wraphelp(
  ["<u>sqrt(x)</u> The square root of x. " +
      "<mark>see sqrt 25</mark>"], Math.sqrt),
  max: wraphelp(
  ["<u>max(x, y, ...)</u> The maximum of a set of values. " +
      "<mark>see max -5, 2, 1</mark>"], Math.max),
  min: wraphelp(
  ["<u>min(x, y, ...)</u> The minimum of a set of values. " +
      "<mark>see min 2, -5, 1</mark>"], Math.min),
  Turtle: wraphelp(
  ["<u>new Turtle(color)</u> Make a new turtle. " +
      "<mark>t = new Turtle; t.fd 100</mark>"], Turtle),
  Pencil: Pencil,
  loadscript: wraphelp(
  ["<u>loadscript(url, callback)</u> Loads Javascript or Coffeescript from " +
       "the given URL, calling callback when done."],
  function loadscript(url, callback) {
    if (window.CoffeeScript && /\.(?:coffee|cs)$/.test(url)) {
      CoffeeScript.load(url, callback);
    } else {
      $.getScript(url, callback);
    }
  }),

  help: globalhelp
};

var extrahelp = {
  finish: {helptext: ["<u>finish()</u> Finishes turtle animation. " +
      "Does not pause for effect: " +
      "<mark>do finish</mark>"]}
};

var sendRecvData = {
  // message passing support
  sent: {},
  waiting: {},
  pollTimer: null
};

function pollSendRecv(name) {
  if (sendRecvData.pollTimer === null) {
    var sq = sendRecvData.sent[name],
        wq = sendRecvData.waiting[name];
    if (wq && wq.length && sq && sq.length) {
      sendRecvData.pollTimer = setTimeout(function() {
        sendRecvData.pollTimer = null;
        if (wq && wq.length && sq && sq.length) {
          wq.shift().apply(null, sq.shift())
          pollSendRecv(name);
        }
      }, 0);
    }
  }
}


deprecate(dollar_turtle_methods, 'defaultspeed', 'speed');

var helpok = {};

var colors = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
  "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
  "burlywood", "cadetblue", "chartreuse", "chocolate", "coral",
  "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
  "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta",
  "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon",
  "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise",
  "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue",
  "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro",
  "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow",
  "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki",
  "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue",
  "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray",
  "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
  "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen",
  "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue",
  "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue",
  "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue",
  "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace",
  "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod",
  "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff",
  "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown",
  "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen",
  "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray",
  "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato",
  "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow",
  "yellowgreen"
];

(function() {
  var specialstrings = [
    "none", "erase", "path", "up", "down",  // Pen modes.
    "color", "position", "normal", // Random modes.
    "touch" // Special Within distances.
  ];
  var definedstrings = specialstrings.concat(colors), j = 0;
  for (; j < definedstrings.length; j++) {
    if (!dollar_turtle_methods.hasOwnProperty(definedstrings[j])) {
      dollar_turtle_methods[definedstrings[j]] = definedstrings[j];
    }
  }
  dollar_turtle_methods.PI = Math.PI;
  dollar_turtle_methods.E = Math.E;
  extrahelp.colors = {helptext:
      ["Defined colors: " + colors.join(" ")]};
  extrahelp.see = {helptext:
      ["<u>see(v)</u> Shows the value of v in the test panel: " +
      "<mark>see document</mark>"]};
  extrahelp.if = extrahelp.else = extrahelp.then = {helptext:
      ["<u>if</u> <u>then</u> <u>else</u> Tests a condition: " +
      "<mark>if 1 <= (new Date).getDay() <= 5 then " +
      "write 'Working hard!' else write 'Happy weekend!'</mark>"]};
  extrahelp.await = extrahelp.defer = {helptext:
      ["<u>await</u> <u>defer</u> Waits for results from an " +
       "asynchronous event; from " +
       '<a href="http://maxtaco.github.io/coffee-script/" target="_blank"' +
       ">Iced CoffeeScript</a>: " +
       "<mark>await readnum defer n</mark>"]};
})();

$.turtle = function turtle(id, options) {
  var exportedsee = false;
  if (!arguments.length) {
    id = 'turtle';
  }
  if (arguments.length == 1 && typeof(id) == 'object' && id &&
      !id.hasOwnProperty('length')) {
    options = id;
    id = 'turtle';
  }
  options = options || {};
  // Clear any previous turtle methods.
  clearGlobalTurtle();
  // Expand any <script type="text/html"> unless htmlscript is false.
  // This is to simplify literal HTML editing within templated editors.
  if (!('htmlscript' in options) || options.htmlscript) {
    $('script[type="text/html"]').each(function() {
        $(this).replaceWith(
            $(this).html().replace(/^\x3c!\[CDATA\[\n?|\]\]\x3e$/g, ''));
    });
  }
  if (!drawing.ctx && ('subpixel' in options)) {
    drawing.subpixel = parseInt(options.subpixel);
  }
  // Set up global events.
  if (!('events' in options) || options.events) {
    turtleevents(options.eventprefix);
  }
  // Set up global log function.
  if (!('see' in options) || options.see) {
    exportsee();
    exportedsee = true;
    if (window.addEventListener) {
      window.addEventListener('error', see);
    } else {
      window.onerror = see;
    }
  }
  // Copy $.turtle.* functions into global namespace.
  if (!('functions' in options) || options.functions) {
    window.printpage = window.print;
    window.print = null;
    $.extend(window, dollar_turtle_methods);
  }
  // Set default turtle speed
  globaldefaultspeed(('defaultspeed' in options) ?
      options.defaultspeed : 1);
  // Initialize audio context (avoids delay in first notes).
  try {
    getAudioTop();
  } catch (e) { }
  // Find or create a singleton turtle if one does not exist.
  var selector = null;
  var wrotebody = false;
  if (id) {
    selector = $('#' + id);
    if (!selector.length) {
      if (!$('body').length) {
        // Initializing without a body?  Force one in!
        document.write('<body>');
        wrotebody = true;
      }
      selector = new Turtle(id);
    }
  }
  if (selector && !selector.length) { selector = null; }
  // Globalize selected jQuery methods of a singleton turtle.
  if (selector && selector.length === 1 &&
      (!('global' in options) || options.global)) {
    var extraturtlefn = {
      css:1, fadeIn:1, fadeOut:1, fadeTo:1, fadeToggle:1,
      animate:1, stop:1, toggle:1, finish:1, promise:1, direct:1 };
    var globalfn = $.extend({}, turtlefn, extraturtlefn);
    global_turtle_methods.push.apply(global_turtle_methods,
       globalizeMethods(selector, globalfn));
    global_turtle = selector[0];
    $(document).on('DOMNodeRemoved.turtle', onDOMNodeRemoved);
  }
  // Set up global objects by id.
  if (!('ids' in options) || options.ids) {
    turtleids(options.idprefix);
    if (selector && id) {
      window[id] = selector;
    }
  }
  // Set up test console.
  if (!('panel' in options) || options.panel) {
    var retval = null,
        seeopt = {
      title: 'test panel (type help for help)',
      abbreviate: [undefined, helpok],
      consolehook: seehelphook
    };
    if (selector) { seeopt.abbreviate.push(selector); }
    if (options.title) {
      seeopt.title = options.title;
    }
    if (options.panelheight) {
      seeopt.height = options.panelheight;
    }
    see.init(seeopt);
    if (wrotebody) {
       see.html('<span style="color:red">Turtle script should be inside body ' +
                '- wrote a &lt;body&gt;</span>');
    }
    // Return an eval loop hook string if 'see' is exported.
    if (exportedsee) {
      if (window.CoffeeScript) {
        return "see.init(eval(see.cs))";
      } else {
        return see.here;
      }
    }
  }
};

$.extend($.turtle, dollar_turtle_methods);

function seehelphook(text, result) {
  if ((typeof result == 'function' || typeof result == 'undefined')
      && /^\w+\s*$/.test(text)) {
    if (result && result.helptext) {
      globalhelp(result);
      return true;
    } else if (text in extrahelp) {
      globalhelp(text);
      return true;
    }
  } else if (typeof result == 'undefined' && /^help\s+\S+$/.test(text)) {
    globalhelp(/^help\s+(\S+)$/.exec(text)[1]);
    return true;
  }
  return false;
}

function copyhelp(method, fname, extrahelp, globalfn) {
  if (method.helptext) {
    globalfn.helptext = method.helptext;
  } else if (fname in extrahelp) {
    globalfn.helptext = extrahelp[fname].helptext;
  }
  globalfn.method = method;
  return globalfn;
}

function globalizeMethods(thisobj, fnames) {
  var replaced = [];
  for (var fname in fnames) {
    if (fnames.hasOwnProperty(fname) && !(fname in window)) {
      replaced.push(fname);
      window[fname] = (function(fname) {
        var method = thisobj[fname], target = thisobj;
        return copyhelp(method, fname, extrahelp,
            (function() { /* Use parentheses to call a function */
                return method.apply(target, arguments); }));
      })(fname);
    }
  }
  return replaced;
}

function clearGlobalTurtle() {
  global_turtle = null;
  for (var j = 0; j < global_turtle_methods.length; ++j) {
    delete window[global_turtle_methods[j]];
  }
  global_turtle_methods.length = 0;
}

function planIfGlobal(fn) {
  if (global_turtle) {
    $(global_turtle).plan(fn);
  } else {
    fn();
  }
}

function onDOMNodeRemoved(e) {
  // Undefine global variable.
  if (e.target.id && window[e.target.id] && window[e.target.id].jquery &&
      window[e.target.id].length === 1 && window[e.target.id][0] === e.target) {
    delete window[e.target.id];
  }
  // Clear global turtle.
  if (e.target === global_turtle) {
    clearGlobalTurtle();
  }
}

function isCSSColor(color) {
  return rgbaForColor(color) !== null;
}

var colorCache = {};

function isNamedColor(name) {
  if (!/^[a-z]+$/.test(name)) {
    return false;
  }
  for (var j = 0; j < colors.length; ++j) {
    if (colors[j] == name) return true;
  }
  return false;
}

function rgbaForColor(color) {
  if (!color || (!isNamedColor(color) &&
      !/^(?:rgb|hsl)a?\([^)]*\)$|^\#[a-f0-9]{3}(?:[a-f0-9]{3})?$/i.test(
          color))) {
    return null;
  }
  if (color in colorCache) {
    return colorCache[color];
  }
  var d = document.createElement('div'), unset = d.style.color,
      result = null, m;
  d.style.color = color;
  if (unset !== d.style.color) {
    m = /rgba?\s*\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\s*\)/.exec($(d).
        css({position:'absolute',top:0,left:0}).appendTo('body').css('color'));
    if (m) {
      result = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]),
                Math.round(255 * (m[4] ? parseFloat(m[4]) : 1))];
    }
    $(d).remove();
  }
  colorCache[color] = result;
  return result;
}

function createTurtleShellOfColor(color) {
  var c = document.createElement('canvas');
  c.width = 40;
  c.height = 48;
  var ctx = c.getContext('2d'),
      cx = 20,
      cy = 26;
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  // Half of a symmetric turtle shell pattern.
  var pattern = [
    [[5, -14], [3, -11]],
    [[3, -11], [7, -8], [4, -4]],
    [[4, -4], [7, 0], [4, 4]],
    [[4, 4], [7, 8], [3, 11]],
    [[7, -8], [12, -9], null],
    [[7, 0], [15, 0], null],
    [[7, 8], [12, 9], null],
    [[3, 11], [1, 15], null]
  ];
  for (var j = 0; j < pattern.length; j++) {
    var path = pattern[j], connect = true;
    ctx.moveTo(cx + path[0][0], cy + path[0][1]);
    for (var k = 1; k < path.length; k++) {
      if (path[k] !== null) {
        ctx.lineTo(cx + path[k][0], cy + path[k][1]);
      }
    }
    for (var k = path.length - 1; k >= 0; k--) {
      if (path[k] === null) {
        k--;
        ctx.moveTo(cx - path[k][0], cy + path[k][1]);
      } else {
        ctx.lineTo(cx - path[k][0], cy + path[k][1]);
      }
    }
  }
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 15.5, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.stroke();
  return c.toDataURL();
}

function createPointerOfColor(color) {
  var c = document.createElement('canvas');
  c.width = 40;
  c.height = 48;
  var ctx = c.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(0,49);
  ctx.lineTo(20,0);
  ctx.lineTo(40,48);
  ctx.lineTo(20,42);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  return c.toDataURL();
}

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"]/g, function(s) {return entityMap[s];});
}

function nameToImg(name) {
  if (name == 'turtle') { name = 'mediumseagreen'; }
  if (isCSSColor(name)) return {
    url: createTurtleShellOfColor(name),
    css: {
      width: 20,
      height: 24,
      turtleHull: "-8 -5 -8 6 0 -13 8 6 8 -5 0 9",
      transformOrigin: '10px 13px',
      opacity: 0.67,
      backgroundImage: 'url(' + turtleGIFUrl + ')',
      backgroundSize: 'contain'
    }
  };
  var openicon =
    /^openicon:\/?\/?([^@\/][^@]*)(?:@(?:(\d+):)?(\d+))?$/.exec(name);
  if (openicon) {
    var openiconName = openicon[1],
        sourceSize = parseInt(openicon[3]),
        targetSize = parseInt(openicon[2]),
        dotloc = openiconName.lastIndexOf('.'),
        openiconType = 'png';
    if (openiconName.indexOf('/') == -1) {
      openiconName = 'others/' + openiconName;
    }
    if (dotloc > 0 && dotloc <= openiconName.length - 4 &&
        dotloc >= openiconName.length - 5) {
      openiconType = openiconName.substring(dotloc + 1);
      openiconName = openiconName.substring(0, dotloc);
    }
    if (!targetSize) {
      targetSize = sourceSize || 24;
    }
    if (!sourceSize) {
      sourceSize = 48;
    }
    return {
      url: 'http://openiconlibrary.sourceforge.net/gallery2/' +
        'open_icon_library-full/icons/' + openiconType + '/' +
        sourceSize + 'x' + sourceSize + '/' +
        openiconName + '.' + openiconType,
      css: {
        width: targetSize,
        height: targetSize,
        transformOrigin: '50% 50%',
        opacity: 1
      }
    }
  }
  if (/^(?:(?:https?|data):)?\//i.exec(name)) {
    return {
      url: name,
      css: {
        transformOrigin: '50% 50%',
        opacity: 1
      }
    }
  }
  return null;
}

function hatchone(name, container, clonepos) {
  var isID = name && /^[a-zA-Z]\w*$/.exec(name),
      isTag = name && /^<.*>$/.exec(name),
      img = nameToImg(name) ||
        (isID || name === undefined) && nameToImg('turtle');

  // Don't overwrite previously existing id.
  if (isID && $('#' + name).length) { isID = false; }

  // Create an image element with the requested name.
  var result;
  if (img) {
    result = $('<img>');
    applyImg(result, img);
  } else if (isTag) {
    result = $(name);
  } else {
    result = $('<div>' + escapeHtml(name) + '</div>');
  }
  // Position the turtle inside the container.
  result.css({
    position: 'absolute',
    display: 'table',
    top: 0,
    left: 0
  });
  if (!container || container.nodeType == 9 || $.isWindow(container)) {
    container = getTurtleField();
  }
  result.appendTo(container);

  // Move it to the starting pos.
  if (clonepos) {
    var t = $.style(clonepos, 'transform');
    if (t) {
      result.css({transform: $.style(clonepos, 'transform')});
    } else {
      result.home(clonepos);
    }
  } else {
    result.home(container);
  }

  // Every hatched turtle has class="turtle".
  result.addClass('turtle');

  // Set the id.
  if (isID) {
    result.attr('id', name);
    // Update global variable unless there is a conflict.
    if (attaching_ids && !window.hasOwnProperty(name)) {
      window[name] = result;
    }
  }
  // Move it to the center of the document and export the name as a global.
  return result;
}

// Simplify Math.floor(Math.random() * N) and also random choice.
function random(arg) {
  if (typeof(arg) == 'number') { return Math.floor(Math.random() * arg); }
  if (typeof(arg) == 'object' && arg.length && arg.slice) {
    return arg[Math.floor(Math.random() * arg.length)];
  }
  if (arg == 'normal') {
    // Ratio of uniforms gaussian, from tinyurl.com/9oh2nqg
    var u, v, x, y, q;
    do {
      u = Math.random();
      v = 1.7156 * (Math.random() - 0.5);
      x = u - 0.449871;
      y = Math.abs(v) + 0.386595;
      q = x * x + y * (0.19600 * y - 0.25472 * x);
    } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
    return v / u;
  }
  if (arg == 'position') {
    return {
      pageX: random(dw() + 1),
      pageY: random(dh() + 1)
    };
  }
  if (arg == 'color') {
    return 'hsl(' + Math.floor(Math.random() * 360) + ',100%,50%)';
  }
  if (arg == 'gray') {
    return 'hsl(0,0,' + Math.floor(Math.random() * 100) + '%)';
  }
  return Math.random();
}

// Simplify setInterval(fn, 1000) to just tick(fn).
var tickinterval = null;
function globaltick(rps, fn) {
  if (fn === undefined && $.isFunction(rps)) {
    fn = rps;
    rps = 1;
  }
  if (tickinterval) {
    window.clearInterval(tickinterval);
    tickinterval = null;
  }
  if (fn && rps) {
    tickinterval = window.setInterval(fn, 1000 / rps);
  }
}

// Allow speed to be set in moves per second.
function globaldefaultspeed(mps) {
  if (mps === undefined) {
    return 1000 / $.fx.speeds.turtle;
  } else {
    $.fx.speeds.turtle = mps > 0 ? 1000 / mps : 0;
  }
}

// Simplify $('#x').move() to just x.move()
function turtleids(prefix) {
  if (prefix === undefined) {
    prefix = '';
  }
  $('[id]').each(function(j, item) {
    window[prefix + item.id] = $('#' + item.id);
  });
  attaching_ids = true;
}

// Simplify $(window).click(function(e) { x.moveto(e); } to just
// x.moveto(lastclick).
var eventsaver = null;
function turtleevents(prefix) {
  if (prefix === undefined) {
    prefix = 'last';
  }
  if (eventsaver) {
    $(window).off($.map(eventfn, function(x,k) { return k; }).join(' '),
        eventsaver);
  }
  if (prefix || prefix === '') {
    eventsaver = (function(e) {
      // Keep the old instance if possible.
      var old = window[prefix + e.type], prop;
      if (old && old.__proto__ === e.__proto__) {
        for (prop in old) { if (old.hasOwnProperty(prop)) delete old[prop]; }
        for (prop in e) { if (e.hasOwnProperty(prop)) old[prop] = e[prop]; }
        return;
      }
      window[prefix + e.type] = e;
    });
    $(window).on($.map(eventfn, function(x,k) { return k; }).join(' '),
        eventsaver);
    for (var k in eventfn) {
      window[prefix + k] = new $.Event();
    }
  }
}

// Simplify $('body').append(html).
function output(html, defaulttag) {
  if (html === undefined || html === null) {
    // Print a turtle shell when no arguments.
    return $('<img>').wear('turtle').css({background: 'none'}).appendTo('body');
  }
  var wrapped = false, result = null;
  html = '' + html;
  while ((result === null || result.length != 1) && !wrapped) {
    // Wrap if obviously not surrounded by a tag already, or if we tried
    // to trust a surrounding tag but found multiple bits.
    if (html.charAt(0) != '<' || html.charAt(html.length - 1) != '>' ||
        (result !== null && result.length != 1)) {
      html = '<' + defaulttag + ' style="display:table;">' +
          html + '</' + defaulttag + '>';
      wrapped = true;
    }
    result = $(html);
  }
  result.appendTo('body');
  return result;
}

// Simplify $('body'>.append('<button>' + label + '</button>').click(fn).
function button(name, callback) {
  if ($.isFunction(name) && callback === undefined) {
    callback = name;
    name = null;
  }
  if (name === null || name === undefined) {
    name = '\u25CE';
  }
  var result = $('<button>' + escapeHtml(name) + '</button>');
  result.appendTo('body');
  if (callback) {
    result.click(callback);
  }
  return result;
}


// Simplify $('body').append('<input>' + label) and onchange hookup.
function input(name, callback, numeric) {
  if ($.isFunction(name) && !callback) {
    callback = name;
    name = null;
  }
  name = $.isNumeric(name) || name ? name : '&rArr;';
  var textbox = $('<input>').css({margin:0, padding:0}),
      label = $(
      '<label style="display:block">' +
      name + '&nbsp;' +
      '</label>').append(textbox),
      thisval = $([textbox[0], label[0]]),
      debounce = null,
      lastseen = textbox.val();
  function dodebounce() {
    if (!debounce) {
      debounce = setTimeout(function() { debounce = null; }, 1000);
    }
  }
  function newval() {
    if (!validate()) { return false; }
    var val = textbox.val();
    if (debounce && lastseen == val) { return; }
    dodebounce();
    lastseen = val;
    textbox.remove();
    label.append(val);
    if (numeric > 0 || (
      numeric >= 0 && $.isNumeric(val) && ('' + parseFloat(val) == val))) {
      val = parseFloat(val);
    }
    if (callback) { callback.call(thisval, val); }
  }
  function validate() {
    if (numeric <= 0) return true;
    var val = textbox.val(),
        nval = val.replace(/[^0-9\.]/g, '');
    if (val != nval || !$.isNumeric(nval)) {
      textbox.val(nval);
      return false;
    }
    return true;
  }
  function key(e) {
    if (e.which == 13) {
      if (!validate()) { return false; }
      newval();
    }
    if (numeric > 0 && (e.which >= 32 && e.which <= 127) &&
        (e.which < '0'.charCodeAt(0) || e.which > '9'.charCodeAt(0)) &&
        (e.which != '.'.charCodeAt(0) || textbox.val().indexOf('.') >= 0)) {
      return false;
    }
  }
  dodebounce();
  textbox.on('keypress keydown', key);
  textbox.on('change', newval);
  $('body').append(label);
  textbox.focus();
  return thisval;
}

// Functions to generate CSS color strings
function componentColor(t, args) {
  return t + '(' + Array.prototype.join.call(args, ',') + ')';
}

// Simplify creation of tables with cells.
function table(height, width, cellCss, tableCss) {
  var contents = null, row, col;
  if ($.isArray(height)) {
    tableCss = cellCss;
    cellCss = width;
    contents = height;
    height = contents.length;
    width = 0;
    for (row = 0; row < height; row++) {
      if ($.isArray(contents[row])) {
        width = Math.max(width, contents[row].length);
      } else {
        width = Math.max(width, 1);
      }
    }
  }
  var html = ['<table>'];
  for (row = 0; row < height; row++) {
    html.push('<tr>');
    for (col = 0; col < width; col++) {
      if (contents) {
        if ($.isArray(contents[row]) && col < contents[row].length) {
          html.push('<td>' + escapeHtml(contents[row][col]) + '</td>');
        } else if (!$.isArray(contents[row]) && col == 0) {
          html.push('<td>' + escapeHtml(contents[row]) + '</td>');
        } else {
          html.push('<td></td>');
        }
      } else {
        html.push('<td></td>');
      }
    }
    html.push('</tr>');
  }
  html.push('</table>');
  var result = $(html.join(''));
  var defaultCss = {
    borderCollapse: 'collapse',
    width: '35px',
    height: '35px',
    border: '1px solid black',
    tableLayout: 'fixed',
    textAlign: 'center',
    margin: '0',
    padding: '0'
  };
  result.css($.extend({}, defaultCss,
    { width: 'auto', height: 'auto', maxWidth: 'auto', border: 'none'},
    tableCss));
  result.find('td').css($.extend({}, defaultCss, cellCss));
  result.appendTo('body');
  return result;
}

//////////////////////////////////////////////////////////////////////////
// WEB AUDIO SUPPORT
// Definition of play("ABC") - uses ABC music note syntax.
//////////////////////////////////////////////////////////////////////////

var ABCtoken = /\s+|\[|\]|>+|<+|(?:(?:\^\^|\^|__|_|=|)[A-Ga-g](?:,+|'+|))|\d*\/\d+|\d+|\/+|[xzXZ]|./g;
var audioTop = null;
function isAudioPresent() {
  return !!(window.AudioContext || window.webkitAudioContext);
}
function getAudioTop() {
  if (!audioTop) {
    var ac = new (window.AudioContext || window.webkitAudioContext),
        dcn = ac.createDynamicsCompressor(),
        firstTime = null;
    dcn.connect(ac.destination);
    audioTop = {
      ac: ac,
      out: dcn,
      // Partial workaround for http://crbug.com/254942:
      // add little extra pauses before scheduling envelopes.
      // A quarter second or so seems to be needed at initial startup,
      // then 1/64 second before scheduling each envelope afterwards.
      nextStartTime: function() {
        if (firstTime === null) {
          firstTime = ac.currentTime;
        }
        return Math.max(firstTime + 0.25,
                        ac.currentTime + 0.015625);
      }
    }
  }
  return audioTop;
}
function parseABCNotes(str) {
  var tokens = str.match(ABCtoken), result = [], stem = null,
      index = 0, dotted = 0, t;
  while (index < tokens.length) {
    if (/^s+$/.test(tokens[index])) { index++; continue; }
    if (/</.test(tokens[index])) { dotted = -tokens[index++].length; continue; }
    if (/>/.test(tokens[index])) { dotted = tokens[index++].length; continue; }
    stem = parseStem(tokens, index);
    if (stem === null) {
      // Skip unparsable bits
      index++;
      continue;
    }
    if (stem !== null) {
      if (dotted && result.length) {
        if (dotted > 0) {
          t = (1 - Math.pow(0.5, dotted)) * stem.value.time;
        } else {
          t = (Math.pow(0.5, -dotted) - 1) * result[result.length - 1].time;
        }
        result[result.length - 1].time += t;
        stem.value.time -= t;
        dotted = 0;
      }
      result.push(stem.value);
      index = stem.index;
    }
  }
  return result;
}
function parseStem(tokens, index) {
  var pitch = [];
  var duration = '';
  if (index < tokens.length && tokens[index] == '[') {
    index++;
    while (index < tokens.length) {
      if (/[A-Ga-g]/.test(tokens[index])) {
        pitch.push(tokens[index++]);
      } else if (/[xzXZ]/.test(tokens[index])) {
        index++;
      } else {
        break;
      }
      if (index < tokens.length && /\d|\//.test(tokens[index])) {
        duration = tokens[index++];
      }
    }
    if (tokens[index] != ']') {
      return null;
    }
    index++;
  } else if (index < tokens.length && /[A-Ga-g]/.test(tokens[index])) {
    pitch.push(tokens[index++]);
  } else if (/^[xzXZ]$/.test(tokens[index])) {
    // Rest - no pitch.
    index++;
  } else {
    return null;
  }
  if (index < tokens.length && /\d|\//.test(tokens[index])) {
    duration = tokens[index++];
  }
  return {
    index: index,
    value: {
      pitch: pitch,
      duration: duration,
      frequency: pitch.map(pitchToFrequency),
      time: durationToTime(duration)
    }
  }
}
function pitchToFrequency(pitch) {
  var m = /^(\^\^|\^|__|_|=|)([A-Ga-g])(,+|'+|)$/.exec(pitch);
  if (!m) { return null; }
  var n = {C:-9,D:-7,E:-5,F:-4,G:-2,A:0,B:2,c:3,d:5,e:7,f:8,g:10,a:12,b:14};
  var a = { '^^':2, '^':1, '': 0, '=':0, '_':-1, '__':-2 };
  var semitone = n[m[2]] + a[m[1]] + (/,/.test(m[3]) ? -12 : 12) * m[3].length;
  return 440 * Math.pow(2, semitone / 12);
}
function durationToTime(duration) {
  var m = /^(\d*)(?:\/(\d*))?$|^(\/+)$/.exec(duration), n, d, i = 0, ilen;
  if (m[3]) return Math.pow(0.5, m[3].length);
  d = (m[2] ? parseFloat(m[2]) : /\//.test(duration) ? 2 : 1);
  // Handle mixed frations:
  ilen = 0;
  n = (m[1] ? parseFloat(m[1]) : 1);
  while (ilen + 1 < m[1].length && n > d) {
    ilen += 1
    i = parseFloat(m[1].substring(0, ilen))
    n = parseFloat(m[1].substring(ilen))
  }
  return i + (n / d);
}
function playABC(done, args) {
  if (!isAudioPresent()) {
    if (done) { done(); }
    return;
  }
  var atop = getAudioTop(),
      firstvoice = 0, argindex, voice, freqmult, beatsecs,
      volume = 0.5, tempo = 120, transpose = 0, type = ['square'],
      venv = {a: 0.01, d: 0.2, s: 0.1, r: 0.1}, envelope = [venv],
      start_time = null, end_time = atop.ac.currentTime,
      notes, vtype, time, fingers, strength, i, g, t,
      atime, slast, rtime, stime, dt, opts;
  if ($.isPlainObject(args[0])) {
    opts = args[0];
    if ('volume' in opts) { volume = opts.volume; }
    if ('tempo' in opts) { tempo = opts.tempo; }
    if ('transpose' in opts) { transpose = opts.transpose; }
    if ('type' in opts) { type = opts.type; }
    if ('envelope' in opts) {
      if ($.isArray(opts.envelope)) {
        envelope = []
        for (i = 0; i < opts.envelope.length; i++) {
          envelope.push($.extend({}, venv, opts.envelope[i]));
        }
      } else {
        $.extend(venv, opts.envelope);
      }
    }
    firstvoice = 1;
  }
  beatsecs = 60 / tempo;
  if (!$.isArray(type)) { type = [type]; }
  if (!$.isArray(volume)) { volume = [volume]; }
  if (!$.isArray(transpose)) { transpose = [transpose]; }
  for (argindex = firstvoice; argindex < args.length; argindex++) {
    voice = argindex - firstvoice;
    notes = parseABCNotes(args[argindex]);
    vtype = type[voice % type.length] || 'square';
    fingers = 0;
    for (i = 0; i < notes.length; i++) {
      fingers = Math.max(fingers, notes[i].frequency.length);
    }
    if (fingers == 0) { continue; }
    // Attenuate chorded voice so chorded power matches volume.
    strength = volume[voice % volume.length] / Math.sqrt(fingers);
    venv = envelope[voice % envelope.length];
    freqmult = Math.pow(2, transpose[voice % transpose.length] / 12);
    if (start_time === null) {
      start_time = atop.nextStartTime();
    }
    time = start_time;
    for (i = 0; i < notes.length; i++) {
      t = notes[i].time;
      if (notes[i].frequency.length > 0) {
        g = atop.ac.createGain();
        stime = t * beatsecs + time;
        atime = Math.min(t, venv.a) * beatsecs + time;
        rtime = Math.max(0, t + venv.r) * beatsecs + time;
        if (atime > rtime) { atime = rtime = (atime + rtime) / 2; }
        if (rtime < stime) { stime = rtime; rtime = t * beatsecs + time; }
        dt = venv.d * beatsecs;
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(strength, atime);
        if ('setTargetAtTime' in g.gain) {
          // Current web audio spec.
          g.gain.setTargetAtTime(venv.s * strength, atime, dt);
        } else {
          // Early draft web audio spec.
          g.gain.setTargetValueAtTime(venv.s * strength, atime, dt);
        }
        slast = venv.s + (1 - venv.s) * Math.exp((atime - stime) / dt);
        g.gain.setValueAtTime(slast * strength, stime);
        g.gain.linearRampToValueAtTime(0, rtime);
        g.connect(atop.out);
        for (var x = 0; x < notes[i].frequency.length; x++) {
          var o = atop.ac.createOscillator();
          o.type = vtype;
          o.frequency.value = notes[i].frequency[x] * freqmult;
          o.connect(g);
          if ('start' in g) {
            // Current web audio spec.
            o.start(time);
            o.stop(rtime);
          } else {
            // Early draft web audio spec.
            o.start(time);
            o.stop(rtime);
          }
        }
      }
      time += t * beatsecs;
    }
    end_time = Math.max(end_time, time);
  }
  function callDequeueWhenDone() {
    if (atop.ac.currentTime < end_time) {
      setTimeout(callDequeueWhenDone, (end_time - atop.ac.currentTime) * 1000);
    } else {
      if (done) { done(); }
    }
  }
  if (done) {
    callDequeueWhenDone();
  }
}

//////////////////////////////////////////////////////////////////////////
// DEBUGGING SUPPORT
//////////////////////////////////////////////////////////////////////////
var debug = {
  init: function initdebug() {
    if (parent && parent.ide) {
      this.ide = parent.ide;
      this.ide.bindframe(window);
      this.attached = true;
    }
  },
  showerror: function showerror(e) {
    if (this.ide) { this.ide.highlight(e, 'debugerror'); }
  },
  attached: false,
  ide: null,
  reportEvent: function reportEvent(name, args) {
    if (this.ide) { this.ide.reportEvent(name, args); }
  },
  eventCounter: 0,
  nextId: function nextId() {
    return debug.eventCounter++;
  }
};

debug.init();

//////////////////////////////////////////////////////////////////////////
// SEE LOGGING SUPPORT
// A copy of see.js here.
// TODO: figure out how to move this into the IDE.
//////////////////////////////////////////////////////////////////////////

// see.js version 0.2

var pulljQueryVersion = null;  // Disable auto-pull of jQuery

var seepkg = 'see'; // Defines the global package name used.
var version = '0.2';
var oldvalue = noteoldvalue(seepkg);
// Option defaults
var linestyle = 'position:relative;display:block;font-family:monospace;' +
  'font-size:16px;word-break:break-all;margin-bottom:3px;padding-left:1em;';
var logdepth = 5;
var autoscroll = false;
var logelement = 'body';
var panel = false;
try {
  // show panel by default if framed inside a top url with /edit/,
  // and if the screen is big enough (i.e., omit mobile clients).
  panel = (window.self !== window.top &&
           screen.width >= 800 && screen.height >= 600 &&
      /^\/edit\//.test(window.top.window.location.pathname));
} catch(e) {}
var see;  // defined below.
var paneltitle = '';
var logconsole = null;
var uselocalstorage = '_loghistory';
var panelheight = 250;
var currentscope = '';
var scopes = {
  '':  { e: window.eval, t: window },
  top: { e: window.eval, t: window }
};
var coffeescript = window.CoffeeScript;
var seejs = '(function(){return eval(arguments[0]);})';

function init(options) {
  if (arguments.length === 0) {
    options = {};
  } else if (arguments.length == 2) {
    var newopt = {};
    newopt[arguments[0]] = arguments[1];
    options = newopt;
  } else if (arguments.length == 1 && typeof arguments[0] == 'function') {
    options = {'eval': arguments[0]};
  }
  if ('jQuery' in options) { $ = options.jQuery; }
  if ('eval' in options) { scopes[''].e = options['eval']; }
  if ('this' in options) { scopes[''].t = options['this']; }
  if ('element' in options) { logelement = options.element; }
  if ('autoscroll' in options) { autoscroll = options.autoscroll; }
  if ('linestyle' in options) { linestyle = options.linestyle; }
  if ('depth' in options) { logdepth = options.depth; }
  if ('panel' in options) { panel = options.panel; }
  if ('height' in options) { panelheight = options.height; }
  if ('title' in options) { paneltitle = options.title; }
  if ('console' in options) { logconsole = options.console; }
  if ('history' in options) { uselocalstorage = options.history; }
  if ('coffee' in options) { coffeescript = options.coffee; }
  if ('abbreviate' in options) { abbreviate = options.abbreviate; }
  if ('consolehook' in options) { consolehook = options.consolehook; }
  if ('noconflict' in options) { noconflict(options.noconflict); }
  if (panel) {
    // panel overrides element and autoscroll.
    logelement = '#_testlog';
    autoscroll = '#_testscroll';
    pulljQuery(tryinitpanel);
  }
  return scope();
}

function scope(name, evalfuncarg, evalthisarg) {
  if (arguments.length <= 1) {
    if (!arguments.length) {
      name = '';
    }
    return seepkg + '.scope(' + cstring(name) + ',' + seejs + ',this)';
  }
  scopes[name] = { e: evalfuncarg, t: evalthisarg };
}

function seeeval(scope, code) {
  if (arguments.length == 1) {
    code = scope;
    scope = '';
  }
  var ef = scopes[''].e, et = scopes[''].t;
  if (scopes.hasOwnProperty(scope)) {
    if (scopes[scope].e) { ef = scopes[scope].e; }
    if (scopes[scope].t) { et = scopes[scope].t; }
  }
  return ef.call(et, code);
}

var varpat = '[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*';
var initialvardecl = new RegExp(
  '^\\s*var\\s+(?:' + varpat + '\\s*,\\s*)*' + varpat + '\\s*;\\s*');

function barecs(s) {
  // Compile coffeescript in bare mode.
  var compiler = coffeescript || window.CoffeeScript;
  var compiled = compiler.compile(s, {bare:1});
  if (compiled) {
    // Further strip top-level var decls out of the coffeescript so
    // that assignments can leak out into the enclosing scope.
    compiled = compiled.replace(initialvardecl, '');
  }
  return compiled;
}

function exportsee() {
  see.repr = repr;
  see.html = loghtml;
  see.noconflict = noconflict;
  see.init = init;
  see.scope = scope;
  see.eval = seeeval;
  see.barecs = barecs;
  see.here = 'eval(' + seepkg + '.init())';
  see.clear = seeclear;
  see.hide = seehide;
  see.show = seeshow;
  see.visible = seevisible;
  see.enter = seeenter;
  see.js = seejs;
  see.cs = '(function(){return eval(' + seepkg + '.barecs(arguments[0]));})';
  see.version = version;
  window[seepkg] = see;
}

function noteoldvalue(name) {
  return {
    name: name,
    has: window.hasOwnProperty(name),
    value: window[name]
  };
}

function restoreoldvalue(old) {
  if (!old.has) {
    delete window[old.name];
  } else {
    window[old.name] = old.value;
  }
}

function noconflict(newname) {
  if (!newname || typeof(newname) != 'string') {
    newname = 'see' + (1 + Math.random() + '').substr(2);
  }
  if (oldvalue) {
    restoreoldvalue(oldvalue);
  }
  seepkg = newname;
  oldvalue = noteoldvalue(newname);
  exportsee();
  return see;
}

function pulljQuery(callback) {
  if (!pulljQueryVersion || ($ && $.fn && $.fn.jquery)) {
    callback();
    return;
  }
  function loadscript(src, callback) {
    function setonload(script, fn) {
      script.onload = script.onreadystatechange = fn;
    }
    var script = document.createElement("script"),
       head = document.getElementsByTagName("head")[0],
       pending = 1;
    setonload(script, function() {
      if (pending && (!script.readyState ||
          {loaded:1,complete:1}[script.readyState])) {
        pending = 0;
        callback();
        setonload(script, null);
        head.removeChild(script);
      }
    });
    script.src = src;
    head.appendChild(script);
  }
  loadscript(
      '//ajax.googleapis.com/ajax/libs/jquery/' +
      pulljQueryVersion + '/jquery.min.js',
      function() {
    $ = jQuery.noConflict(true);
    callback();
  });
}

// ---------------------------------------------------------------------
// LOG FUNCTION SUPPORT
// ---------------------------------------------------------------------
var logcss = "input._log:focus{outline:none;}samp._logcaret{position:absolute;left:0;font-size:120%;}samp._logcaret:before{content: '>'}label._log > span:first-of-type:hover{text-decoration:underline;}samp._log > label._log,samp_.log > span > label._log{display:inline-block;vertical-align:top;}label._log > span:first-of-type{margin-left:2em;text-indent:-1em;}label._log > ul{display:none;padding-left:14px;margin:0;}label._log > span:before{content:'';font-size:70%;font-style:normal;display:inline-block;width:0;text-align:center;}label._log > span:first-of-type:before{content:'\\0025B6';}label._log > ul > li{display:block;white-space:pre-line;margin-left:2em;text-indent:-1em}label._log > ul > li > samp{margin-left:-1em;text-indent:0;white-space:pre;}label._log > input[type=checkbox]:checked ~ span{margin-left:2em;text-indent:-1em;}label._log > input[type=checkbox]:checked ~ span:first-of-type:before{content:'\\0025BC';}label._log > input[type=checkbox]:checked ~ span:before{content:'';}label._log,label._log > input[type=checkbox]:checked ~ ul{display:block;}label._log > span:first-of-type,label._log > input[type=checkbox]:checked ~ span{display:inline-block;}label._log > input[type=checkbox],label._log > input[type=checkbox]:checked ~ span > span{display:none;}";
var addedcss = false;
var cescapes = {
  '\0': '\\0', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r',
  '\t': '\\t', '\v': '\\v', "'": "\\'", '"': '\\"', '\\': '\\\\'
};
var retrying = null;
var queue = [];
see = function see() {
  if (logconsole && typeof(logconsole.log) == 'function') {
    logconsole.log.apply(window.console, arguments);
  }
  var args = Array.prototype.slice.call(arguments);
  queue.push('<samp class="_log">');
  while (args.length) {
    var obj = args.shift();
    if (vtype(obj) == 'String')  {
      // Logging a string just outputs the string without quotes.
      queue.push(htmlescape(obj));
    } else {
      queue.push(repr(obj, logdepth, queue));
    }
    if (obj instanceof Error || obj instanceof ErrorEvent) {
      // Logging an error event will highlight the error line if in an ide.
      debug.showerror(obj);
    }
    if (args.length) { queue.push(' '); }
  }
  queue.push('</samp>');
  flushqueue();
};

function loghtml(html) {
  queue.push('<samp class="_log">');
  queue.push(html);
  queue.push('</samp>');
  flushqueue();
}

function vtype(obj) {
  var bracketed = Object.prototype.toString.call(obj);
  var vt = bracketed.substring(8, bracketed.length - 1);
  if (vt == 'Object') {
    if ('length' in obj && 'slice' in obj && 'number' == typeof obj.length) {
      return 'Array';
    }
    if ('originalEvent' in obj && 'target' in obj && 'type' in obj) {
      return vtype(obj.originalEvent);
    }
  }
  return vt;
}

function isprimitive(vt) {
  switch (vt) {
    case 'String':
    case 'Number':
    case 'Boolean':
    case 'Undefined':
    case 'Date':
    case 'RegExp':
    case 'Null':
      return true;
  }
  return false;
}

function isdom(obj) {
  return (obj.nodeType && obj.nodeName && typeof(obj.cloneNode) == 'function');
}

function midtruncate(s, maxlen) {
  if (maxlen && maxlen > 3 && s.length > maxlen) {
    return s.substring(0, Math.floor(maxlen / 2) - 1) + '...' +
        s.substring(s.length - (Math.ceil(maxlen / 2) - 2));
  }
  return s;
}

function cstring(s, maxlen) {
  function cescape(c) {
    if (cescapes.hasOwnProperty(c)) {
      return cescapes[c];
    }
    var temp = '0' + c.charCodeAt(0).toString(16);
    return '\\x' + temp.substring(temp.length - 2);
  }
  if (s.indexOf('"') == -1 || s.indexOf('\'') != -1) {
    return midtruncate('"' +
        htmlescape(s.replace(/[\0-\x1f\x7f-\x9f"\\]/g, cescape)) + '"', maxlen);
  } else {
    return midtruncate("'" +
        htmlescape(s.replace(/[\0-\x1f\x7f-\x9f'\\]/g, cescape)) + "'", maxlen);
  }
}
function tiny(obj, maxlen) {
  var vt = vtype(obj);
  if (vt == 'String') { return cstring(obj, maxlen); }
  if (vt == 'Undefined' || vt == 'Null') { return vt.toLowerCase(); }
  if (isprimitive(vt)) { return '' + obj; }
  if (vt == 'Array' && obj.length === 0) { return '[]'; }
  if (vt == 'Object' && isshort(obj)) { return '{}'; }
  if (isdom(obj) && obj.nodeType == 1) {
    if (obj.hasAttribute('id')) {
      return obj.tagName.toLowerCase() +
          '#' + htmlescape(obj.getAttribute('id'));
    } else {
      if (obj.hasAttribute('class')) {
        var classname = obj.getAttribute('class').split(' ')[0];
        if (classname) {
          return obj.tagName.toLowerCase() + '.' + htmlescape(classname);
        }
      }
      return obj.tagName.toLowerCase();
    }
  }
  return vt;
}
function isnonspace(dom) {
  return (dom.nodeType != 3 || /[^\s]/.exec(dom.textContent));
}
function trimemptystartline(s) {
  return s.replace(/^\s*\n/, '');
}
function isshort(obj, shallow, maxlen) {
  var vt = vtype(obj);
  if (isprimitive(vt)) { return true; }
  if (!shallow && vt == 'Array') { return !maxlen || obj.length <= maxlen; }
  if (isdom(obj)) {
    if (obj.nodeType == 9 || obj.nodeType == 11) return false;
    if (obj.nodeType == 1) {
      return (obj.firstChild === null ||
         obj.firstChild.nextSibling === null &&
         obj.firstChild.nodeType == 3 &&
         obj.firstChild.textContent.length <= maxlen);
    }
    return true;
  }
  if (vt == 'Function') {
    var sc = obj.toString();
    return (sc.length - sc.indexOf('{') <= maxlen);
  }
  if (vt == 'Error') {
    return !!obj.stack;
  }
  var count = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      count += 1;
      if (shallow && !isprimitive(vtype(obj[prop]))) { return false; }
      if (maxlen && count > maxlen) { return false; }
    }
  }
  return true;
}
function domsummary(dom, maxlen) {
  var short;
  if ('outerHTML' in dom) {
    short = isshort(dom, true, maxlen);
    var html = dom.cloneNode(short).outerHTML;
    var tail = null;
    if (!short) {
      var m = /^(.*)(<\/[^\s]*>$)/.exec(html);
      if (m) {
        tail = m[2];
        html = m[1];
      }
    }
    return [htmlescape(html), tail && htmlescape(tail)];
  }
  if (dom.nodeType == 1) {
    var parts = ['<' + dom.tagName];
    for (var j = 0; j < dom.attributes.length; ++j) {
      parts.push(domsummary(dom.attributes[j], maxlen)[0]);
    }
    short = isshort(dom, true, maxlen);
    if (short && dom.firstChild) {
      return [htmlescape(parts.join(' ') + '>' +
          dom.firstChild.textContent + '</' + dom.tagName + '>'), null];
    }
    return [htmlescape(parts.join(' ') + (dom.firstChild? '>' : '/>')),
        !dom.firstChild ? null : htmlescape('</' + dom.tagName + '>')];
  }
  if (dom.nodeType == 2) {
    return [htmlescape(dom.name + '="' +
        htmlescape(midtruncate(dom.value, maxlen), '"') + '"'), null];
  }
  if (dom.nodeType == 3) {
    return [htmlescape(trimemptystartline(dom.textContent)), null];
  }
  if (dom.nodeType == 4) {
    return ['<![CDATA[' + htmlescape(midtruncate(dom.textContent, maxlen)) +
        ']]>', null];
  }
  if (dom.nodeType == 8) {
    return ['<!--' + htmlescape(midtruncate(dom.textContent, maxlen)) +
        '-->', null];
  }
  if (dom.nodeType == 10) {
    return ['<!DOCTYPE ' + htmlescape(dom.nodeName) + '>', null];
  }
  return [dom.nodeName, null];
}
function summary(obj, maxlen) {
  var vt = vtype(obj);
  if (isprimitive(vt)) {
    return tiny(obj, maxlen);
  }
  if (isdom(obj)) {
    var ds = domsummary(obj, maxlen);
    return ds[0] + (ds[1] ? '...' + ds[1] : '');
  }
  if (vt == 'Function') {
    var ft = obj.toString();
    if (ft.length - ft.indexOf('{') > maxlen) {
      ft = ft.replace(/\{(?:.|\n)*$/, '').trim();
    }
    return ft;
  }
  if ((vt == 'Error' || vt == 'ErrorEvent') && 'message' in obj) {
    return obj.message;
  }
  var pieces = [];
  if (vt == 'Array' && obj.length < maxlen) {
    var identical = (obj.length >= 5);
    var firstobj = identical && obj[0];
    for (var j = 0; j < obj.length; ++j) {
      if (identical && obj[j] !== firstobj) { identical = false; }
      pieces.push(tiny(obj[j], maxlen));
    }
    if (identical) {
      return '[' + tiny(firstobj, maxlen) + '] \xd7 ' + obj.length;
    }
    return '[' + pieces.join(', ') + ']';
  } else if (isshort(obj, false, maxlen)) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        pieces.push(quotekey(key) + ': ' + tiny(obj[key], maxlen));
      }
    }
    return (vt == 'Object' ? '{' : vt + '{') + pieces.join(', ') + '}';
  }
  if (vt == 'Array') { return 'Array(' + obj.length + ')'; }
  return vt;
}
function quotekey(k) {
  if (/^\w+$/.exec(k)) { return k; }
  return cstring(k);
}
function htmlescape(s, q) {
  var pat = /[<>&]/g;
  if (q) { pat = new RegExp('[<>&' + q + ']', 'g'); }
  return s.replace(pat, function(c) {
    return c == '<' ? '&lt;' : c == '>' ? '&gt;' : c == '&' ? '&amp;' :
           c == '"' ? '&quot;' : '&#' + c.charCodeAt(0) + ';';
  });
}
function unindented(s) {
  s = s.replace(/^\s*\n/, '');
  var leading = s.match(/^\s*\S/mg);
  var spaces = leading.length && leading[0].length - 1;
  var j = 1;
  // If the block begins with a {, ignore those spaces.
  if (leading.length > 1 && leading[0].trim() == '{') {
    spaces = leading[1].length - 1;
    j = 2;
  }
  for (; j < leading.length; ++j) {
    spaces = Math.min(leading[j].length - 1, spaces);
    if (spaces <= 0) { return s; }
  }
  var removal = new RegExp('^\\s{' + spaces + '}', 'mg');
  return s.replace(removal, '');
}
function expand(prefix, obj, depth, output) {
  output.push('<label class="_log"><input type="checkbox"><span>');
  if (prefix) { output.push(prefix); }
  if (isdom(obj)) {
    var ds = domsummary(obj, 10);
    output.push(ds[0]);
    output.push('</span><ul>');
    for (var node = obj.firstChild; node; node = node.nextSibling) {
      if (isnonspace(node)) {
        if (node.nodeType == 3) {
          output.push('<li><samp>');
          output.push(unindented(node.textContent));
          output.push('</samp></li>');
        } else if (isshort(node, true, 20) || depth <= 1) {
          output.push('<li>' + summary(node, 20) + '</li>');
        } else {
          expand('', node, depth - 1, output);
        }
      }
    }
    output.push('</ul>');
    if (ds[1]) {
      output.push('<span>');
      output.push(ds[1]);
      output.push('</span>');
    }
    output.push('</label>');
  } else {
    output.push(summary(obj, 10));
    output.push('</span><ul>');
    var vt = vtype(obj);
    if (vt == 'Function') {
      var ft = obj.toString();
      var m = /\{(?:.|\n)*$/.exec(ft);
      if (m) { ft = m[0]; }
      output.push('<li><samp>');
      output.push(htmlescape(unindented(ft)));
      output.push('</samp></li>');
    } else if (vt == 'Error') {
      output.push('<li><samp>');
      output.push(htmlescape(obj.stack));
      output.push('</samp></li>');
    } else if (vt == 'Array') {
      for (var j = 0; j < Math.min(100, obj.length); ++j) {
        try {
          val = obj[j];
        } catch(e) {
          val = e;
        }
        if (isshort(val, true, 20) || depth <= 1 || vtype(val) == 'global') {
          output.push('<li>' + j + ': ' + summary(val, 100) + '</li>');
        } else {
          expand(j + ': ', val, depth - 1, output);
        }
      }
      if (obj.length > 100) {
        output.push('<li>length=' + obj.length + ' ...</li>');
      }
    } else {
      var count = 0;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          count += 1;
          if (count > 100) { continue; }
          var val;
          try {
            val = obj[key];
          } catch(e) {
            val = e;
          }
          if (isshort(val, true, 20) || depth <= 1 || vtype(val) == 'global') {
            output.push('<li>');
            output.push(quotekey(key));
            output.push(': ');
            output.push(summary(val, 100));
            output.push('</li>');
          } else {
            expand(quotekey(key) + ': ', val, depth - 1, output);
          }
        }
      }
      if (count > 100) {
        output.push('<li>' + count + ' properties total...</li>');
      }
    }
    output.push('</ul></label>');
  }
}
function initlogcss() {
  if (!addedcss && !window.document.getElementById('_logcss')) {
    var style = window.document.createElement('style');
    style.id = '_logcss';
    style.innerHTML = (linestyle ? 'samp._log{' +
        linestyle + '}' : '') + logcss;
    window.document.head.appendChild(style);
    addedcss = true;
  }
}
function repr(obj, depth, aoutput) {
  depth = depth || 3;
  var output = aoutput || [];
  var vt = vtype(obj);
  if (vt == 'Error' || vt == 'ErrorEvent') {
    output.push('<span style="color:red;">');
    expand('', obj, depth, output);
    output.push('</span>');
  } else if (isprimitive(vt)) {
    output.push(tiny(obj));
  } else if (isshort(obj, true, 100) || depth <= 0) {
    output.push(summary(obj, 100));
  } else {
    expand('', obj, depth, output);
  }
  if (!aoutput) {
    return output.join('');
  }
}
function aselement(s, def) {
  switch (typeof s) {
    case 'string':
      if (s == 'body') { return document.body; }
      if (document.querySelector) { return document.querySelector(s); }
      if ($) { return $(s)[0]; }
      return null;
    case 'undefined':
      return def;
    case 'boolean':
      if (s) { return def; }
      return null;
    default:
      return s;
  }
  return null;
}
function stickscroll() {
  var stick = false, a = aselement(autoscroll, null);
  if (a) {
    stick = a.scrollHeight - a.scrollTop - 10 <= a.clientHeight;
  }
  if (stick) {
    return (function() {
      a.scrollTop = a.scrollHeight - a.clientHeight;
    });
  } else {
    return (function() {});
  }
}
function flushqueue() {
  var elt = aselement(logelement, null);
  if (elt && elt.appendChild && queue.length) {
    initlogcss();
    var temp = window.document.createElement('samp');
    temp.innerHTML = queue.join('');
    queue.length = 0;
    var complete = stickscroll();
    while (child = temp.firstChild) {
      elt.appendChild(child);
    }
    complete();
  }
  if (!retrying && queue.length) {
    retrying = setTimeout(function() { timer = null; flushqueue(); }, 100);
  } else if (retrying && !queue.length) {
    clearTimeout(retrying);
    retrying = null;
  }
}

// ---------------------------------------------------------------------
// TEST PANEL SUPPORT
// ---------------------------------------------------------------------
var addedpanel = false;
var inittesttimer = null;
var abbreviate = [{}.undefined];
var consolehook = null;

function seehide() {
  $('#_testpanel').hide();
}
function seeshow() {
  $('#_testpanel').show();
}
function seevisible() {
  return $('#_testpanel').is(':visible');
}
function seeenter(text) {
  $('#_testinput').val(text);
}
function seeclear() {
  if (!addedpanel) { return; }
  $('#_testlog').find('._log').not('#_testpaneltitle').remove();
}
function promptcaret(color) {
  return '<samp class="_logcaret" style="color:' + color + ';"></samp>';
}
function getSelectedText(){
    if(window.getSelection) { return window.getSelection().toString(); }
    else if(document.getSelection) { return document.getSelection(); }
    else if(document.selection) {
        return document.selection.createRange().text; }
}
function formattitle(title) {
  return '<samp class="_log" id="_testpaneltitle" style="font-weight:bold;">' +
      title + '</samp>';
}
function readlocalstorage() {
  if (!uselocalstorage) {
    return;
  }
  var state = { height: panelheight, history: [] };
  try {
    var result = window.JSON.parse(window.localStorage[uselocalstorage]);
    if (result && result.slice && result.length) {
      // if result is an array, then it's just the history.
      state.history = result;
      return state;
    }
    $.extend(state, result);
  } catch(e) {
  }
  return state;
}
function updatelocalstorage(state) {
  if (!uselocalstorage) {
    return;
  }
  var stored = readlocalstorage(), changed = false;
  if ('history' in state &&
      state.history.length &&
      (!stored.history.length ||
      stored.history[stored.history.length - 1] !==
      state.history[state.history.length - 1])) {
    stored.history.push(state.history[state.history.length - 1]);
    changed = true;
  }
  if ('height' in state && state.height !== stored.height) {
    stored.height = state.height;
    changed = true;
  }
  if (changed) {
    window.localStorage[uselocalstorage] = window.JSON.stringify(stored);
  }
}
function wheight() {
  return window.innerHeight || $(window).height();
}
function tryinitpanel() {
  if (addedpanel) {
    if (paneltitle) {
      if ($('#_testpaneltitle').length) {
        $('#_testpaneltitle').html(paneltitle);
      } else {
        $('#_testlog').prepend(formattitle(paneltitle));
      }
    }
    $('#_testpanel').show();
  } else {
    if (!window.document.getElementById('_testlog') && window.document.body) {
      initlogcss();
      var state = readlocalstorage();
      var titlehtml = (paneltitle ? formattitle(paneltitle) : '');
      if (state.height > wheight() - 50) {
        state.height = Math.min(wheight(), Math.max(10, wheight() - 50));
      }
      $('body').prepend(
        '<samp id="_testpanel" style="overflow:hidden;z-index:99;' +
            'position:fixed;bottom:0;left:0;width:100%;height:' + state.height +
            'px;background:rgba(240,240,240,0.8);' +
            'font:10pt monospace;' +
            // This last bit works around this position:fixed bug in webkit:
            // https://code.google.com/p/chromium/issues/detail?id=128375
            '-webkit-transform:translateZ(0);">' +
          '<samp id="_testdrag" style="' +
              'cursor:row-resize;height:6px;width:100%;' +
              'display:block;background:lightgray"></samp>' +
          '<samp id="_testscroll" style="overflow-y:scroll;overflow-x:hidden;' +
             'display:block;width:100%;height:' + (state.height - 6) + 'px;">' +
            '<samp id="_testlog" style="display:block">' +
            titlehtml + '</samp>' +
            '<samp class="_log" style="position:relative;display:block;">' +
            promptcaret('blue') +
            '<input id="_testinput" class="_log" style="width:100%;' +
                'margin:0;border:0;font:inherit;' +
                'background:rgba(255,255,255,0.8);">' +
           '</samp>' +
        '</samp>');
      addedpanel = true;
      flushqueue();
      var historyindex = 0;
      var historyedited = {};
      $('#_testinput').on('keydown', function(e) {
	if (e.which == 13) {
          // Handle the Enter key.
          var text = $(this).val();
          $(this).val('');
          // Save (nonempty, nonrepeated) commands to history and localStorage.
          if (text.trim().length &&
              (!state.history.length ||
               state.history[state.history.length - 1] !== text)) {
            state.history.push(text);
            updatelocalstorage({ history: [text] });
          }
          // Reset up/down history browse state.
          historyedited = {};
          historyindex = 0;
          // Copy the entered prompt into the log, with a grayed caret.
          loghtml('<samp class="_log" style="margin-left:-1em;">' +
                  promptcaret('lightgray') +
                  htmlescape(text) + '</samp>');
          $(this).select();
          // Deal with the ":scope" command
          if (text.trim().length && text.trim()[0] == ':') {
            var scopename = text.trim().substring(1).trim();
            if (!scopename || scopes.hasOwnProperty(scopename)) {
              currentscope = scopename;
              var desc = scopename ? 'scope ' + scopename : 'default scope';
              loghtml('<span style="color:blue">switched to ' + desc + '</span>');
            } else {
              loghtml('<span style="color:red">no scope ' + scopename + '</span>');
            }
            return;
          }
          // Actually execute the command and log the results (or error).
          var hooked = false;
          try {
            var result;
            try {
              result = seeeval(currentscope, text);
            } finally {
              if (consolehook && consolehook(text, result)) {
                hooked = true;
              } else {
                // Show the result (unless abbreviated).
                for (var j = abbreviate.length - 1; j >= 0; --j) {
                  if (result === abbreviate[j]) break;
                }
                if (j < 0) {
                  loghtml(repr(result));
                }
              }
            }
          } catch (e) {
            // Show errors (unless hooked).
            if (!hooked) {
              see(e);
            }
          }
        } else if (e.which == 38 || e.which == 40) {
          // Handle the up and down arrow keys.
          // Stow away edits in progress (without saving to history).
          historyedited[historyindex] = $(this).val();
          // Advance the history index up or down, pegged at the boundaries.
          historyindex += (e.which == 38 ? 1 : -1);
          historyindex = Math.max(0, Math.min(state.history.length,
              historyindex));
          // Show the remembered command at that slot.
          var newval = historyedited[historyindex] ||
              state.history[state.history.length - historyindex];
          if (typeof newval == 'undefined') { newval = ''; }
          $(this).val(newval);
          this.selectionStart = this.selectionEnd = newval.length;
          e.preventDefault();
        }
      });
      $('#_testdrag').on('mousedown', function(e) {
        var drag = this,
            dragsum = $('#_testpanel').height() + e.pageY,
            barheight = $('#_testdrag').height(),
            dragwhich = e.which,
            dragfunc;
        if (drag.setCapture) { drag.setCapture(true); }
        dragfunc = function dragresize(e) {
          if (e.type != 'blur' && e.which == dragwhich) {
            var winheight = wheight();
            var newheight = Math.max(barheight, Math.min(winheight,
                dragsum - e.pageY));
            var complete = stickscroll();
            $('#_testpanel').height(newheight);
            $('#_testscroll').height(newheight - barheight);
            complete();
          }
          if (e.type == 'mouseup' || e.type == 'blur' ||
              e.type == 'mousemove' && e.which != dragwhich) {
            $(window).off('mousemove mouseup blur', dragfunc);
            if (document.releaseCapture) { document.releaseCapture(); }
            if ($('#_testpanel').height() != state.height) {
              state.height = $('#_testpanel').height();
              updatelocalstorage({ height: state.height });
            }
          }
        };
        $(window).on('mousemove mouseup blur', dragfunc);
        return false;
      });
      $('#_testpanel').on('mouseup', function(e) {
        if (getSelectedText()) { return; }
        // Focus without scrolling.
        var scrollpos = $('#_testscroll').scrollTop();
        $('#_testinput').focus();
        $('#_testscroll').scrollTop(scrollpos);
      });
    }
  }
  if (inittesttimer && addedpanel) {
    clearTimeout(inittesttimer);
  } else if (!addedpanel && !inittesttimer) {
    inittesttimer = setTimeout(tryinitpanel, 100);
  }
}

eval("scope('jquery-turtle', " + seejs + ", this)");

})(jQuery);
;/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var value = ac[index],
          other = bc[index];

      if (value !== other) {
        if (value > other || typeof value == 'undefined') {
          return 1;
        }
        if (value < other || typeof other == 'undefined') {
          return -1;
        }
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to return the same value for
    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See http://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object deoptimizations by using `slice` instead
          // of `Array.prototype.slice.call` and not assigning `arguments` to a
          // variable as a ternary expression
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var bindData = func.__bindData__;
      if (typeof bindData == 'undefined') {
        if (support.funcNames) {
          bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            bindData = !reFuncName.test(source);
          }
          if (!bindData) {
            // checks if `func` references the `this` keyword and stores the result
            bindData = reThis.test(source);
            setBindData(func, bindData);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];

      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;

      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     */
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
          result = [];

      if (isLarge) {
        var cache = createCache(values);
        if (cache) {
          indexOf = cacheIndexOf;
          values = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(values);
      }
      return result;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns a random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        indexOf = cacheIndexOf;
        seen = cache;
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = collection ? collection.length : 0;

        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData && bindData !== true) {
        // clone `bindData`
        bindData = slice(bindData);
        if (bindData[2]) {
          bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
          bindData[3] = slice(bindData[3]);
        }
        // set `thisBinding` is not previously bound
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        // set if previously bound but not currently (subsequent curried functions)
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        // set curried arity if not yet set
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        // append partial left arguments
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        // append partial right arguments
        if (isPartialRight) {
          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        // merge flags
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
      }
      // fast path for `_.bind`
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = function(object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var object = { 'name': 'barney' };
     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var assign = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
        }
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `isDeep` and `callback`
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;
      }
      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var object = { 'name': 'barney' };
     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var defaults = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];
        }
        }
      }
      return result
    };

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': false },
     *   'fred': {    'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1,  'blocked': false }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': true },
     *   'fred': {    'age': 40, 'blocked': false },
     *   'pebbles': { 'age': 1,  'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
     */
    var forIn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/fred/);
     * // => true
     */
    function isRegExp(value) {
      return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('fred');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg, 3);

      forOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var props = [];
        forIn(object, function(value, key) {
          props.push(key);
        });
        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          result[key] = object[key];
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (!callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? forEach : forOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The name of the property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions like `_.map`
     *  without using their `index` arguments as `n`.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          isArr = isArray(callback),
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      if (!isArr) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        if (isArr) {
          object.criteria = map(callback, function(key) { return value[key]; });
        } else {
          (object.criteria = getArray())[0] = callback(value, key, collection);
        }
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        if (!isArr) {
          releaseArray(object.criteria);
        }
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} props The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40, 'blocked': false },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(characters, 'blocked');
     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(characters, 'blocked');
     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = getArray(),
          indexOf = getIndexOf(),
          trustIndexOf = indexOf === baseIndexOf,
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(trustIndexOf && value.length >= largeArraySize &&
            createCache(argsIndex ? args[argsIndex] : seen));
        }
      }
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.last(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.last(characters, { 'employer': 'na' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.rest(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.rest(characters, { 'employer': 'slate' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See http://en.wikipedia.org/wiki/Symmetric_difference.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
            : array;
        }
      }
      return result || [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
        : createWrapper(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createWrapper(key, 19, slice(arguments, 2), null, object)
        : createWrapper(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createWrapper(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createWrapper(func, 32, null, slice(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('Fred, Wilma, & Pebbles');
     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Fred, Wilma, & Pebbles');
     * // => 'Fred, Wilma, &amp; Pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Creates a "_.pluck" style function, which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text = String(text || '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Fred, Barney &amp; Pebbles');
     * // => 'Fred, Barney & Pebbles'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      forOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.4.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));
