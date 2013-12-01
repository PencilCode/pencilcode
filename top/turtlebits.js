/**
 * IcedCoffeeScript Compiler v1.6.3-g
 * http://iced-coffee-script.github.io/iced-coffee-script
 *
 * Copyright 2011, Jeremy Ashkenas, Maxwell Krohn
 * Released under the MIT License
 */
!function(root){var CoffeeScript=function(){function require(e){return require[e]}return require["./helpers"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o;e.starts=function(e,t,n){return t===e.substr(n,t.length)},e.ends=function(e,t,n){var i;return i=t.length,t===e.substr(e.length-i-(n||0),i)},e.repeat=r=function(e,t){var n;for(n="";t>0;)1&t&&(n+=e),t>>>=1,e+=e;return n},e.compact=function(e){var t,n,i,s;for(s=[],n=0,i=e.length;i>n;n++)t=e[n],t&&s.push(t);return s},e.count=function(e,t){var n,i;if(n=i=0,!t.length)return 1/0;for(;i=1+e.indexOf(t,i);)n++;return n},e.merge=function(e,t){return n(n({},e),t)},n=e.extend=function(e,t){var n,i;for(n in t)i=t[n],e[n]=i;return e},e.flatten=i=function(e){var t,n,s,r;for(n=[],s=0,r=e.length;r>s;s++)t=e[s],t instanceof Array?n=n.concat(i(t)):n.push(t);return n},e.del=function(e,t){var n;return n=e[t],delete e[t],n},e.last=s=function(e,t){return e[e.length-(t||0)-1]},e.some=null!=(o=Array.prototype.some)?o:function(e){var t,n,i;for(n=0,i=this.length;i>n;n++)if(t=this[n],e(t))return!0;return!1},e.invertLiterate=function(e){var t,n,i;return i=!0,n=function(){var n,s,r,o;for(r=e.split("\n"),o=[],n=0,s=r.length;s>n;n++)t=r[n],i&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?o.push(t):(i=/^\s*$/.test(t))?o.push(t):o.push("# "+t);return o}(),n.join("\n")},t=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},e.addLocationDataFn=function(e,n){return function(i){return"object"==typeof i&&i.updateLocationDataIfMissing&&i.updateLocationDataIfMissing(t(e,n)),i}},e.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?""+(t.first_line+1)+":"+(t.first_column+1)+"-"+(""+(t.last_line+1)+":"+(t.last_column+1)):"No location data"},e.baseFileName=function(e,t,n){var i,s;return null==t&&(t=!1),null==n&&(n=!1),s=n?/\\|\//:/\//,i=e.split(s),e=i[i.length-1],t?(i=e.split("."),i.pop(),"coffee"===i[i.length-1]&&i.length>1&&i.pop(),i.join(".")):e},e.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md|iced)$/.test(e)},e.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},e.throwSyntaxError=function(e,t){var n;throw null==t.last_line&&(t.last_line=t.first_line),null==t.last_column&&(t.last_column=t.first_column),n=new SyntaxError(e),n.location=t,n},e.prettyErrorMessage=function(e,t,n,i){var s,o,a,c,u,h,l,p,d,f,m;return e.location?(t=e.filename||t,n=e.code||n,m=e.location,u=m.first_line,c=m.first_column,l=m.last_line,h=m.last_column,s=n.split("\n")[u],f=c,a=u===l?h+1:s.length,p=r(" ",f)+r("^",a-f),i&&(o=function(e){return"[1;31m"+e+"[0m"},s=s.slice(0,f)+o(s.slice(f,a))+s.slice(a),p=o(p)),d=""+t+":"+(u+1)+":"+(c+1)+": error: "+e.message+"\n"+s+"\n"+p):e.stack||""+e}}.call(this),t.exports}(),require["./rewriter"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,u,h,l,p,d,f,m,w,g,b,y=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},v=[].slice;for(d=function(e,t){var n;return n=[e,t],n.generated=!0,n},e.Rewriter=function(){function e(){}return e.prototype.rewrite=function(e){return this.tokens=e,this.removeLeadingNewlines(),this.removeMidExpressionNewlines(),this.closeOpenCalls(),this.closeOpenIndexes(),this.addImplicitIndentation(),this.tagPostfixConditionals(),this.addImplicitBracesAndParens(),this.addLocationDataToGeneratedTokens(),this.tokens},e.prototype.scanTokens=function(e){var t,n,i;for(i=this.tokens,t=0;n=i[t];)t+=e.call(this,n,t,i);return!0},e.prototype.detectEnd=function(e,t,n){var r,o,a,c,u;for(a=this.tokens,r=0;o=a[e];){if(0===r&&t.call(this,o,e))return n.call(this,o,e);if(!o||0>r)return n.call(this,o,e-1);c=o[0],y.call(s,c)>=0?r+=1:(u=o[0],y.call(i,u)>=0&&(r-=1)),e+=1}return e-1},e.prototype.removeLeadingNewlines=function(){var e,t,n,i,s;for(s=this.tokens,e=n=0,i=s.length;i>n&&(t=s[e][0],"TERMINATOR"===t);e=++n);return e?this.tokens.splice(0,e):void 0},e.prototype.removeMidExpressionNewlines=function(){return this.scanTokens(function(e,t,i){var s;return"TERMINATOR"===e[0]&&(s=this.tag(t+1),y.call(n,s)>=0)?(i.splice(t,1),0):1})},e.prototype.closeOpenCalls=function(){var e,t;return t=function(e,t){var n;return")"===(n=e[0])||"CALL_END"===n||"OUTDENT"===e[0]&&")"===this.tag(t-1)},e=function(e,t){return this.tokens["OUTDENT"===e[0]?t-1:t][0]="CALL_END"},this.scanTokens(function(n,i){return"CALL_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.closeOpenIndexes=function(){var e,t;return t=function(e){var t;return"]"===(t=e[0])||"INDEX_END"===t},e=function(e){return e[0]="INDEX_END"},this.scanTokens(function(n,i){return"INDEX_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.matchTags=function(){var e,t,n,i,s,r,o;for(t=arguments[0],i=2<=arguments.length?v.call(arguments,1):[],e=0,n=s=0,r=i.length;r>=0?r>s:s>r;n=r>=0?++s:--s){for(;"HERECOMMENT"===this.tag(t+n+e);)e+=2;if(null!=i[n]&&("string"==typeof i[n]&&(i[n]=[i[n]]),o=this.tag(t+n+e),y.call(i[n],o)<0))return!1}return!0},e.prototype.looksObjectish=function(e){return this.matchTags(e,"@",null,":")||this.matchTags(e,null,":")},e.prototype.findTagsBackwards=function(e,t){var n,r,o,a,c,u,l;for(n=[];e>=0&&(n.length||(a=this.tag(e),y.call(t,a)<0&&(c=this.tag(e),y.call(s,c)<0||this.tokens[e].generated)&&(u=this.tag(e),y.call(h,u)<0)));)r=this.tag(e),y.call(i,r)>=0&&n.push(this.tag(e)),o=this.tag(e),y.call(s,o)>=0&&n.length&&n.pop(),e-=1;return l=this.tag(e),y.call(t,l)>=0},e.prototype.addImplicitBracesAndParens=function(){var e;return e=[],this.scanTokens(function(t,n,u){var l,p,f,m,w,g,b,v,k,_,C,F,T,L,x,N,D,E,A,S,I,R,$,O,P,j,B;if(I=t[0],_=(n>0?u[n-1]:[])[0],v=(n<u.length-1?u[n+1]:[])[0],N=function(){return e[e.length-1]},D=n,f=function(e){return n-D+e},m=function(){var e,t;return null!=(e=N())?null!=(t=e[2])?t.ours:void 0:void 0},w=function(){var e;return m()&&"("===(null!=(e=N())?e[0]:void 0)},b=function(){var e;return m()&&"{"===(null!=(e=N())?e[0]:void 0)},g=function(){var e;return m&&"CONTROL"===(null!=(e=N())?e[0]:void 0)},E=function(t){var i;return i=null!=t?t:n,e.push(["(",i,{ours:!0}]),u.splice(i,0,d("CALL_START","(")),null==t?n+=1:void 0},l=function(){return e.pop(),u.splice(n,0,d("CALL_END",")")),n+=1},A=function(t,i){var s;return null==i&&(i=!0),s=null!=t?t:n,e.push(["{",s,{sameLine:!0,startsLine:i,ours:!0}]),u.splice(s,0,d("{",d(new String("{")))),null==t?n+=1:void 0},p=function(t){return t=null!=t?t:n,e.pop(),u.splice(t,0,d("}","}")),n+=1},w()&&("IF"===I||"TRY"===I||"FINALLY"===I||"CATCH"===I||"CLASS"===I||"SWITCH"===I))return e.push(["CONTROL",n,{ours:!0}]),f(1);if("INDENT"===I&&m()){if("=>"!==_&&"->"!==_&&"["!==_&&"("!==_&&","!==_&&"{"!==_&&"TRY"!==_&&"ELSE"!==_&&"="!==_)for(;w();)l();return g()&&e.pop(),e.push([I,n]),f(1)}if(y.call(s,I)>=0)return e.push([I,n]),f(1);if(y.call(i,I)>=0){for(;m();)w()?l():b()?p():e.pop();e.pop()}if((y.call(a,I)>=0&&t.spaced&&!t.stringEnd||"?"===I&&n>0&&!u[n-1].spaced)&&(y.call(r,v)>=0||y.call(c,v)>=0&&!(null!=(R=u[n+1])?R.spaced:void 0)&&!(null!=($=u[n+1])?$.newLine:void 0)))return"?"===I&&(I=t[0]="FUNC_EXIST"),E(n+1),C=f(2);if(y.call(a,I)>=0&&this.matchTags(n+1,"INDENT",null,":")&&!this.findTagsBackwards(n,["CLASS","EXTENDS","IF","CATCH","SWITCH","LEADING_WHEN","FOR","WHILE","UNTIL"]))return E(n+1),e.push(["INDENT",n+2]),f(3);if(":"===I){for(F="@"===this.tag(n-2)?n-2:n-1;"HERECOMMENT"===this.tag(F-2);)F-=2;return S=0===F||(O=this.tag(F-1),y.call(h,O)>=0)||u[F-1].newLine,N()&&(P=N(),x=P[0],L=P[1],("{"===x||"INDENT"===x&&"{"===this.tag(L-1))&&(S||","===this.tag(F-1)||"{"===this.tag(F-1)))?f(1):(A(F,!!S),f(2))}if("OUTDENT"===_&&w()&&("."===I||"?."===I||"::"===I||"?::"===I))return l(),f(1);if(b()&&y.call(h,I)>=0&&(N()[2].sameLine=!1),y.call(o,I)>=0)for(;m();)if(j=N(),x=j[0],L=j[1],B=j[2],T=B.sameLine,S=B.startsLine,w()&&","!==_)l();else if(b()&&T&&!S)p();else{if(!b()||"TERMINATOR"!==I||","===_||S&&this.looksObjectish(n+1))break;p()}if(","===I&&!this.looksObjectish(n+1)&&b()&&("TERMINATOR"!==v||!this.looksObjectish(n+2)))for(k="OUTDENT"===v?1:0;b();)p(n+k);return f(1)})},e.prototype.addLocationDataToGeneratedTokens=function(){return this.scanTokens(function(e,t,n){var i,s,r,o,a,c;return e[2]?1:e.generated||e.explicit?("{"===e[0]&&(r=null!=(a=n[t+1])?a[2]:void 0)?(s=r.first_line,i=r.first_column):(o=null!=(c=n[t-1])?c[2]:void 0)?(s=o.last_line,i=o.last_column):s=i=0,e[2]={first_line:s,first_column:i,last_line:s,last_column:i},1):1})},e.prototype.addImplicitIndentation=function(){var e,t,n,i,s;return s=n=i=null,t=function(e){var t,n;return";"!==e[1]&&(t=e[0],y.call(l,t)>=0)&&!("ELSE"===e[0]&&"THEN"!==s)&&!!("CATCH"!==(n=e[0])&&"FINALLY"!==n||"->"!==s&&"=>"!==s)},e=function(e,t){return this.tokens.splice(","===this.tag(t-1)?t-1:t,0,i)},this.scanTokens(function(r,o,a){var c,u,h,l,d;if(u=r[0],"TERMINATOR"===u&&"THEN"===this.tag(o+1))return a.splice(o,1),0;if("ELSE"===u&&"OUTDENT"!==this.tag(o-1))return a.splice.apply(a,[o,0].concat(v.call(this.indentation()))),2;if("CATCH"===u)for(c=h=1;2>=h;c=++h)if("OUTDENT"===(l=this.tag(o+c))||"TERMINATOR"===l||"FINALLY"===l)return a.splice.apply(a,[o+c,0].concat(v.call(this.indentation()))),2+c;return y.call(p,u)>=0&&"INDENT"!==this.tag(o+1)&&("ELSE"!==u||"IF"!==this.tag(o+1))?(s=u,d=this.indentation(!0),n=d[0],i=d[1],"THEN"===s&&(n.fromThen=!0),a.splice(o+1,0,n),this.detectEnd(o+2,t,e),"THEN"===u&&a.splice(o,1),1):1})},e.prototype.tagPostfixConditionals=function(){var e,t,n;return n=null,t=function(e,t){var n,i;return i=e[0],n=this.tokens[t-1][0],"TERMINATOR"===i||"INDENT"===i&&y.call(p,n)<0},e=function(e){return"INDENT"!==e[0]||e.generated&&!e.fromThen?n[0]="POST_"+n[0]:void 0},this.scanTokens(function(i,s){return"IF"!==i[0]?1:(n=i,this.detectEnd(s+1,t,e),1)})},e.prototype.indentation=function(e){var t,n;return null==e&&(e=!1),t=["INDENT",2],n=["OUTDENT",2],e&&(t.generated=n.generated=!0),e||(t.explicit=n.explicit=!0),[t,n]},e.prototype.generate=d,e.prototype.tag=function(e){var t;return null!=(t=this.tokens[e])?t[0]:void 0},e}(),t=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["CALL_START","CALL_END"],["PARAM_START","PARAM_END"],["INDEX_START","INDEX_END"]],e.INVERSES=u={},s=[],i=[],w=0,g=t.length;g>w;w++)b=t[w],f=b[0],m=b[1],s.push(u[m]=f),i.push(u[f]=m);n=["CATCH","WHEN","ELSE","FINALLY"].concat(i),a=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@","THIS"],r=["IDENTIFIER","NUMBER","STRING","JS","REGEX","NEW","PARAM_START","CLASS","IF","TRY","SWITCH","THIS","BOOL","NULL","UNDEFINED","UNARY","SUPER","THROW","@","->","=>","[","(","{","--","++"],c=["+","-"],o=["POST_IF","FOR","WHILE","UNTIL","WHEN","BY","LOOP","TERMINATOR"],p=["ELSE","->","=>","TRY","FINALLY","THEN"],l=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"],h=["TERMINATOR","INDENT","OUTDENT"],a.push("DEFER"),r.push("DEFER"),o.push("AWAIT")}.call(this),t.exports}(),require["./lexer"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,F,T,L,x,N,D,E,A,S,I,R,$,O,P,j,B,V,M,H,U,W,q,G,X,Y,z,K,J,Q,Z,et=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};Q=require("./rewriter"),O=Q.Rewriter,b=Q.INVERSES,Z=require("./helpers"),W=Z.count,K=Z.starts,U=Z.compact,X=Z.last,z=Z.repeat,q=Z.invertLiterate,Y=Z.locationDataToString,J=Z.throwSyntaxError,e.Lexer=T=function(){function e(){}return e.prototype.tokenize=function(e,t){var n,i,s,r;for(null==t&&(t={}),this.literate=t.literate,this.indent=0,this.baseIndent=0,this.indebt=0,this.outdebt=0,this.indents=[],this.ends=[],this.tokens=[],this.chunkLine=t.line||0,this.chunkColumn=t.column||0,e=this.clean(e),i=0;this.chunk=e.slice(i);)n=this.identifierToken()||this.commentToken()||this.whitespaceToken()||this.lineToken()||this.heredocToken()||this.stringToken()||this.numberToken()||this.regexToken()||this.jsToken()||this.literalToken(),r=this.getLineAndColumnFromChunk(n),this.chunkLine=r[0],this.chunkColumn=r[1],i+=n;return this.closeIndentation(),(s=this.ends.pop())&&this.error("missing "+s),t.rewrite===!1?this.tokens:(new O).rewrite(this.tokens)},e.prototype.clean=function(e){return e.charCodeAt(0)===t&&(e=e.slice(1)),e=e.replace(/\r/g,"").replace(V,""),H.test(e)&&(e="\n"+e,this.chunkLine--),this.literate&&(e=q(e)),e},e.prototype.identifierToken=function(){var e,t,n,i,s,c,u,h,l,p,d,f,m,g;return(u=w.exec(this.chunk))?(c=u[0],i=u[1],e=u[2],s=i.length,h=void 0,"own"===i&&"FOR"===this.tag()?(this.token("OWN",i),i.length):(n=e||(l=X(this.tokens))&&("."===(f=l[0])||"?."===f||"::"===f||"?::"===f||!l.spaced&&"@"===l[0])&&"defer"!==i,p="IDENTIFIER",!n&&(et.call(k,i)>=0||et.call(a,i)>=0)&&(p=i.toUpperCase(),"WHEN"===p&&(m=this.tag(),et.call(_,m)>=0)?p="LEADING_WHEN":"FOR"===p?this.seenFor=!0:"UNLESS"===p?p="IF":et.call(M,p)>=0?p="UNARY":et.call(R,p)>=0&&("INSTANCEOF"!==p&&this.seenFor?(p="FOR"+p,this.seenFor=!1):(p="RELATION","!"===this.value()&&(h=this.tokens.pop(),i="!"+i)))),et.call(v,i)>=0&&(n?(p="IDENTIFIER",i=new String(i),i.reserved=!0):et.call($,i)>=0&&this.error('reserved word "'+i+'"')),n||(et.call(r,i)>=0&&(i=o[i]),p=function(){switch(i){case"!":return"UNARY";case"==":case"!=":return"COMPARE";case"&&":case"||":return"LOGIC";case"true":case"false":return"BOOL";case"break":case"continue":return"STATEMENT";default:return p}}()),d=this.token(p,i,0,s),h&&(g=[h[2].first_line,h[2].first_column],d[2].first_line=g[0],d[2].first_column=g[1]),e&&(t=c.lastIndexOf(":"),this.token(":",":",t,e.length)),c.length)):0},e.prototype.numberToken=function(){var e,t,n,i,s;return(n=A.exec(this.chunk))?(i=n[0],/^0[BOX]/.test(i)?this.error("radix prefix '"+i+"' must be lowercase"):/E/.test(i)&&!/^0x/.test(i)?this.error("exponential notation '"+i+"' must be indicated with a lowercase 'e'"):/^0\d*[89]/.test(i)?this.error("decimal literal '"+i+"' must not be prefixed with '0'"):/^0\d+/.test(i)&&this.error("octal literal '"+i+"' must be prefixed with '0o'"),t=i.length,(s=/^0o([0-7]+)/.exec(i))&&(i="0x"+parseInt(s[1],8).toString(16)),(e=/^0b([01]+)/.exec(i))&&(i="0x"+parseInt(e[1],2).toString(16)),this.token("NUMBER",i,0,t),t):0},e.prototype.stringToken=function(){var e,t,n;switch(this.chunk.charAt(0)){case"'":if(!(e=j.exec(this.chunk)))return 0;n=e[0],this.token("STRING",n.replace(x,"\\\n"),0,n.length);break;case'"':if(!(n=this.balancedString(this.chunk,'"')))return 0;0<n.indexOf("#{",1)?this.interpolateString(n.slice(1,-1),{strOffset:1,lexedLength:n.length}):this.token("STRING",this.escapeLines(n,0,n.length));break;default:return 0}return(t=/^(?:\\.|[^\\])*\\(?:0[0-7]|[1-7])/.test(n))&&this.error("octal escape sequences "+n+" are not allowed"),n.length},e.prototype.heredocToken=function(){var e,t,n,i;return(n=l.exec(this.chunk))?(t=n[0],i=t.charAt(0),e=this.sanitizeHeredoc(n[2],{quote:i,indent:null}),'"'===i&&0<=e.indexOf("#{")?this.interpolateString(e,{heredoc:!0,strOffset:3,lexedLength:t.length}):this.token("STRING",this.makeString(e,i,!0),0,t.length),t.length):0},e.prototype.commentToken=function(){var e,t,n;return(n=this.chunk.match(c))?(e=n[0],t=n[1],t&&this.token("HERECOMMENT",this.sanitizeHeredoc(t,{herecomment:!0,indent:z(" ",this.indent)}),0,e.length),e.length):0},e.prototype.jsToken=function(){var e,t;return"`"===this.chunk.charAt(0)&&(e=y.exec(this.chunk))?(this.token("JS",(t=e[0]).slice(1,-1),0,t.length),t.length):0},e.prototype.regexToken=function(){var e,t,n,i,s,r,o;return"/"!==this.chunk.charAt(0)?0:(n=f.exec(this.chunk))?t=this.heregexToken(n):(i=X(this.tokens),i&&(r=i[0],et.call(i.spaced?D:E,r)>=0)?0:(n=I.exec(this.chunk))?(o=n,n=o[0],s=o[1],e=o[2],"/*"===s.slice(0,2)&&this.error("regular expressions cannot begin with `*`"),"//"===s&&(s="/(?:)/"),this.token("REGEX",""+s+e,0,n.length),n.length):0)},e.prototype.heregexToken=function(e){var t,n,i,s,r,o,a,c,u,h,l,p,d,f,w,g;if(s=e[0],t=e[1],n=e[2],0>t.indexOf("#{"))return a=t.replace(m,"").replace(/\//g,"\\/"),a.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(a||"(?:)")+"/"+n,0,s.length),s.length;for(this.token("IDENTIFIER","RegExp",0,0),this.token("CALL_START","(",0,0),h=[],f=this.interpolateString(t,{regex:!0}),p=0,d=f.length;d>p;p++){if(u=f[p],c=u[0],l=u[1],"TOKENS"===c)h.push.apply(h,l);else if("NEOSTRING"===c){if(!(l=l.replace(m,"")))continue;l=l.replace(/\\/g,"\\\\"),u[0]="STRING",u[1]=this.makeString(l,'"',!0),h.push(u)}else this.error("Unexpected "+c);o=X(this.tokens),r=["+","+"],r[2]=o[2],h.push(r)}return h.pop(),"STRING"!==(null!=(w=h[0])?w[0]:void 0)&&(this.token("STRING",'""',0,0),this.token("+","+",0,0)),(g=this.tokens).push.apply(g,h),n&&(i=s.lastIndexOf(n),this.token(",",",",i,0),this.token("STRING",'"'+n+'"',i,n.length)),this.token(")",")",s.length-1,0),s.length},e.prototype.lineToken=function(){var e,t,n,i,s;if(!(n=N.exec(this.chunk)))return 0;if(t=n[0],this.seenFor=!1,s=t.length-1-t.lastIndexOf("\n"),i=this.unfinished(),s-this.indebt===this.indent)return i?this.suppressNewlines():this.newlineToken(0),t.length;if(s>this.indent){if(i)return this.indebt=s-this.indent,this.suppressNewlines(),t.length;if(!this.tokens.length)return this.baseIndent=this.indent=s,t.length;e=s-this.indent+this.outdebt,this.token("INDENT",e,t.length-s,s),this.indents.push(e),this.ends.push("OUTDENT"),this.outdebt=this.indebt=0}else s<this.baseIndent?this.error("missing indentation",t.length):(this.indebt=0,this.outdentToken(this.indent-s,i,t.length));return this.indent=s,t.length},e.prototype.outdentToken=function(e,t,n){for(var i,s;e>0;)s=this.indents.length-1,void 0===this.indents[s]?e=0:this.indents[s]===this.outdebt?(e-=this.outdebt,this.outdebt=0):this.indents[s]<this.outdebt?(this.outdebt-=this.indents[s],e-=this.indents[s]):(i=this.indents.pop()+this.outdebt,e-=i,this.outdebt=0,this.pair("OUTDENT"),this.token("OUTDENT",i,0,n));for(i&&(this.outdebt-=e);";"===this.value();)this.tokens.pop();return"TERMINATOR"===this.tag()||t||this.token("TERMINATOR","\n",n,0),this},e.prototype.whitespaceToken=function(){var e,t,n;return(e=H.exec(this.chunk))||(t="\n"===this.chunk.charAt(0))?(n=X(this.tokens),n&&(n[e?"spaced":"newLine"]=!0),e?e[0].length:0):0},e.prototype.newlineToken=function(e){for(;";"===this.value();)this.tokens.pop();return"TERMINATOR"!==this.tag()&&this.token("TERMINATOR","\n",e,0),this},e.prototype.suppressNewlines=function(){return"\\"===this.value()&&this.tokens.pop(),this},e.prototype.literalToken=function(){var e,t,n,r,o,a,c,l;if((e=S.exec(this.chunk))?(r=e[0],s.test(r)&&this.tagParameters()):r=this.chunk.charAt(0),n=r,t=X(this.tokens),"="===r&&t&&(!t[1].reserved&&(o=t[1],et.call(v,o)>=0)&&this.error('reserved word "'+this.value()+"\" can't be assigned"),"||"===(a=t[1])||"&&"===a))return t[0]="COMPOUND_ASSIGN",t[1]+="=",r.length;if(";"===r)this.seenFor=!1,n="TERMINATOR";else if(et.call(L,r)>=0)n="MATH";else if(et.call(u,r)>=0)n="COMPARE";else if(et.call(h,r)>=0)n="COMPOUND_ASSIGN";else if(et.call(M,r)>=0)n="UNARY";else if(et.call(P,r)>=0)n="SHIFT";else if(et.call(F,r)>=0||"?"===r&&(null!=t?t.spaced:void 0))n="LOGIC";else if(t&&!t.spaced)if("("===r&&(c=t[0],et.call(i,c)>=0))"?"===t[0]&&(t[0]="FUNC_EXIST"),n="CALL_START";else if("["===r&&(l=t[0],et.call(g,l)>=0))switch(n="INDEX_START",t[0]){case"?":t[0]="INDEX_SOAK"}switch(r){case"(":case"{":case"[":this.ends.push(b[r]);break;case")":case"}":case"]":this.pair(r)}return this.token(n,r),r.length},e.prototype.sanitizeHeredoc=function(e,t){var n,i,s,r,o;if(s=t.indent,i=t.herecomment){if(p.test(e)&&this.error('block comment cannot contain "*/", starting'),e.indexOf("\n")<0)return e}else for(;r=d.exec(e);)n=r[1],(null===s||0<(o=n.length)&&o<s.length)&&(s=n);return s&&(e=e.replace(RegExp("\\n"+s,"g"),"\n")),i||(e=e.replace(/^\n/,"")),e},e.prototype.tagParameters=function(){var e,t,n,i;if(")"!==this.tag())return this;for(t=[],i=this.tokens,e=i.length,i[--e][0]="PARAM_END";n=i[--e];)switch(n[0]){case")":t.push(n);break;case"(":case"CALL_START":if(!t.length)return"("===n[0]?(n[0]="PARAM_START",this):this;t.pop()}return this},e.prototype.closeIndentation=function(){return this.outdentToken(this.indent)},e.prototype.balancedString=function(e,t){var n,i,s,r,o,a,c,u;for(n=0,a=[t],i=c=1,u=e.length;u>=1?u>c:c>u;i=u>=1?++c:--c)if(n)--n;else{switch(s=e.charAt(i)){case"\\":++n;continue;case t:if(a.pop(),!a.length)return e.slice(0,+i+1||9e9);t=a[a.length-1];continue}"}"!==t||'"'!==s&&"'"!==s?"}"===t&&"/"===s&&(r=f.exec(e.slice(i))||I.exec(e.slice(i)))?n+=r[0].length-1:"}"===t&&"{"===s?a.push(t="}"):'"'===t&&"#"===o&&"{"===s&&a.push(t="}"):a.push(t=s),o=s}return this.error("missing "+a.pop()+", starting")},e.prototype.interpolateString=function(t,n){var i,s,r,o,a,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,F,T,L,x,N,D,E;for(null==n&&(n={}),r=n.heredoc,y=n.regex,m=n.offsetInChunk,k=n.strOffset,l=n.lexedLength,m=m||0,k=k||0,l=l||t.length,r&&t.length>0&&"\n"===t[0]&&(t=t.slice(1),k++),F=[],w=0,o=-1;h=t.charAt(o+=1);)"\\"!==h?"#"===h&&"{"===t.charAt(o+1)&&(s=this.balancedString(t.slice(o+1),"}"))&&(o>w&&F.push(this.makeToken("NEOSTRING",t.slice(w,o),k+w)),a=s.slice(1,-1),a.length&&(N=this.getLineAndColumnFromChunk(k+o+1),p=N[0],i=N[1],f=(new e).tokenize(a,{line:p,column:i,rewrite:!1}),b=f.pop(),"TERMINATOR"===(null!=(D=f[0])?D[0]:void 0)&&(b=f.shift()),(u=f.length)&&(u>1&&(f.unshift(this.makeToken("(","(",k+o+1,0)),f.push(this.makeToken(")",")",k+o+1+a.length,0))),F.push(["TOKENS",f]))),o+=s.length,w=o+1):o+=1;if(o>w&&w<t.length&&F.push(this.makeToken("NEOSTRING",t.slice(w),k+w)),y)return F;if(!F.length)return this.token("STRING",'""',m,l);for("NEOSTRING"!==F[0][0]&&F.unshift(this.makeToken("NEOSTRING","",m)),(c=F.length>1)&&this.token("(","(",m,0),o=L=0,x=F.length;x>L;o=++L)C=F[o],_=C[0],T=C[1],o&&(o&&(g=this.token("+","+")),d="TOKENS"===_?T[0]:C,g[2]={first_line:d[2].first_line,first_column:d[2].first_column,last_line:d[2].first_line,last_column:d[2].first_column}),"TOKENS"===_?(E=this.tokens).push.apply(E,T):"NEOSTRING"===_?(C[0]="STRING",C[1]=this.makeString(T,'"',r),this.tokens.push(C)):this.error("Unexpected "+_);return c&&(v=this.makeToken(")",")",m+l,0),v.stringEnd=!0,this.tokens.push(v)),F},e.prototype.pair=function(e){var t,n;return e!==(n=X(this.ends))?("OUTDENT"!==n&&this.error("unmatched "+e),this.indent-=t=X(this.indents),this.outdentToken(t,!0),this.pair(e)):this.ends.pop()},e.prototype.getLineAndColumnFromChunk=function(e){var t,n,i,s;return 0===e?[this.chunkLine,this.chunkColumn]:(s=e>=this.chunk.length?this.chunk:this.chunk.slice(0,+(e-1)+1||9e9),n=W(s,"\n"),t=this.chunkColumn,n>0?(i=s.split("\n"),t=X(i).length):t+=s.length,[this.chunkLine+n,t])},e.prototype.makeToken=function(e,t,n,i){var s,r,o,a,c;return null==n&&(n=0),null==i&&(i=t.length),r={},a=this.getLineAndColumnFromChunk(n),r.first_line=a[0],r.first_column=a[1],s=Math.max(0,i-1),c=this.getLineAndColumnFromChunk(n+s),r.last_line=c[0],r.last_column=c[1],o=[e,t,r]},e.prototype.token=function(e,t,n,i){var s;return s=this.makeToken(e,t,n,i),this.tokens.push(s),s},e.prototype.tag=function(e,t){var n;return(n=X(this.tokens,e))&&(t?n[0]=t:n[0])},e.prototype.value=function(e,t){var n;return(n=X(this.tokens,e))&&(t?n[1]=t:n[1])},e.prototype.unfinished=function(){var e;return C.test(this.chunk)||"\\"===(e=this.tag())||"."===e||"?."===e||"?::"===e||"UNARY"===e||"MATH"===e||"+"===e||"-"===e||"SHIFT"===e||"RELATION"===e||"COMPARE"===e||"LOGIC"===e||"THROW"===e||"EXTENDS"===e},e.prototype.escapeLines=function(e,t){return e.replace(x,t?"\\n":"")},e.prototype.makeString=function(e,t,n){return e?(e=e.replace(/\\([\s\S])/g,function(e,n){return"\n"===n||n===t?n:e}),e=e.replace(RegExp(""+t,"g"),"\\$&"),t+this.escapeLines(e,n)+t):t+t},e.prototype.error=function(e,t){var n,i,s;return null==t&&(t=0),s=this.getLineAndColumnFromChunk(t),i=s[0],n=s[1],J(e,{first_line:i,first_column:n})},e}(),k=["true","false","null","this","new","delete","typeof","in","instanceof","return","throw","break","continue","debugger","if","else","switch","for","while","do","try","catch","finally","class","extends","super"],a=["undefined","then","unless","until","loop","of","by","when"],a=a.concat(["await","defer"]),o={and:"&&",or:"||",is:"==",isnt:"!=",not:"!",yes:"true",no:"false",on:"true",off:"false"},r=function(){var e;e=[];for(G in o)e.push(G);return e}(),a=a.concat(r),$=["case","default","function","var","void","with","const","let","enum","export","import","native","__hasProp","__extends","__slice","__bind","__indexOf","implements","interface","package","private","protected","public","static","yield"],B=["arguments","eval"],v=k.concat($).concat(B),e.RESERVED=$.concat(k).concat(a).concat(B),e.STRICT_PROSCRIBED=B,t=65279,w=/^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/,A=/^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i,l=/^("""|''')([\s\S]*?)(?:\n[^\n\S]*)?\1/,S=/^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?(\.|::)|\.{2,3})/,H=/^[^\n\S]+/,c=/^###([^#][\s\S]*?)(?:###[^\n\S]*|(?:###)$)|^(?:\s*#(?!##[^#]).*)+/,s=/^[-=]>/,N=/^(?:\n[^\n\S]*)+/,j=/^'[^\\']*(?:\\.[^\\']*)*'/,y=/^`[^\\`]*(?:\\.[^\\`]*)*`/,I=/^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/,f=/^\/{3}([\s\S]+?)\/{3}([imgy]{0,4})(?!\w)/,m=/\s+(?:#.*)?/g,x=/\n/g,d=/\n+([^\n\S]*)/g,p=/\*\//,C=/^\s*(?:,|\??\.(?![.\d])|::)/,V=/\s+$/,h=["-=","+=","/=","*=","%=","||=","&&=","?=","<<=",">>=",">>>=","&=","^=","|="],M=["!","~","NEW","TYPEOF","DELETE","DO"],F=["&&","||","&","|","^"],P=["<<",">>",">>>"],u=["==","!=","<",">","<=",">="],L=["*","/","%"],R=["IN","OF","INSTANCEOF"],n=["TRUE","FALSE"],D=["NUMBER","REGEX","BOOL","NULL","UNDEFINED","++","--"],E=D.concat(")","}","THIS","IDENTIFIER","STRING","]"),i=["IDENTIFIER","STRING","REGEX",")","]","}","?","::","@","THIS","SUPER"],g=i.concat("NUMBER","BOOL","NULL","UNDEFINED"),_=["INDENT","OUTDENT","TERMINATOR"],i.push("DEFER")}.call(this),t.exports}(),require["./parser"]=function(){var e={},t={exports:e},n=function(){function e(){this.yy={}}var t={trace:function(){},yy:{},symbols_:{error:2,Root:3,Body:4,Line:5,TERMINATOR:6,Expression:7,Statement:8,Return:9,Comment:10,STATEMENT:11,Await:12,AWAIT:13,Block:14,Value:15,Invocation:16,Code:17,Operation:18,Assign:19,If:20,Try:21,While:22,For:23,Switch:24,Class:25,Throw:26,Defer:27,INDENT:28,OUTDENT:29,Identifier:30,IDENTIFIER:31,AlphaNumeric:32,NUMBER:33,STRING:34,Literal:35,JS:36,REGEX:37,DEBUGGER:38,UNDEFINED:39,NULL:40,BOOL:41,Assignable:42,"=":43,AssignObj:44,ObjAssignable:45,":":46,ThisProperty:47,RETURN:48,HERECOMMENT:49,PARAM_START:50,ParamList:51,PARAM_END:52,FuncGlyph:53,"->":54,"=>":55,OptComma:56,",":57,Param:58,ParamVar:59,"...":60,Array:61,Object:62,Splat:63,SimpleAssignable:64,Accessor:65,Parenthetical:66,Range:67,This:68,".":69,"?.":70,"::":71,"?::":72,Index:73,INDEX_START:74,IndexValue:75,INDEX_END:76,INDEX_SOAK:77,Slice:78,"{":79,AssignList:80,"}":81,CLASS:82,EXTENDS:83,OptFuncExist:84,Arguments:85,SUPER:86,DEFER:87,FUNC_EXIST:88,CALL_START:89,CALL_END:90,ArgList:91,THIS:92,"@":93,"[":94,"]":95,RangeDots:96,"..":97,Arg:98,SimpleArgs:99,TRY:100,Catch:101,FINALLY:102,CATCH:103,THROW:104,"(":105,")":106,WhileSource:107,WHILE:108,WHEN:109,UNTIL:110,Loop:111,LOOP:112,ForBody:113,FOR:114,ForStart:115,ForSource:116,ForVariables:117,OWN:118,ForValue:119,FORIN:120,FOROF:121,BY:122,SWITCH:123,Whens:124,ELSE:125,When:126,LEADING_WHEN:127,IfBlock:128,IF:129,POST_IF:130,UNARY:131,"-":132,"+":133,"--":134,"++":135,"?":136,MATH:137,SHIFT:138,COMPARE:139,LOGIC:140,RELATION:141,COMPOUND_ASSIGN:142,$accept:0,$end:1},terminals_:{2:"error",6:"TERMINATOR",11:"STATEMENT",13:"AWAIT",28:"INDENT",29:"OUTDENT",31:"IDENTIFIER",33:"NUMBER",34:"STRING",36:"JS",37:"REGEX",38:"DEBUGGER",39:"UNDEFINED",40:"NULL",41:"BOOL",43:"=",46:":",48:"RETURN",49:"HERECOMMENT",50:"PARAM_START",52:"PARAM_END",54:"->",55:"=>",57:",",60:"...",69:".",70:"?.",71:"::",72:"?::",74:"INDEX_START",76:"INDEX_END",77:"INDEX_SOAK",79:"{",81:"}",82:"CLASS",83:"EXTENDS",86:"SUPER",87:"DEFER",88:"FUNC_EXIST",89:"CALL_START",90:"CALL_END",92:"THIS",93:"@",94:"[",95:"]",97:"..",100:"TRY",102:"FINALLY",103:"CATCH",104:"THROW",105:"(",106:")",108:"WHILE",109:"WHEN",110:"UNTIL",112:"LOOP",114:"FOR",118:"OWN",120:"FORIN",121:"FOROF",122:"BY",123:"SWITCH",125:"ELSE",127:"LEADING_WHEN",129:"IF",130:"POST_IF",131:"UNARY",132:"-",133:"+",134:"--",135:"++",136:"?",137:"MATH",138:"SHIFT",139:"COMPARE",140:"LOGIC",141:"RELATION",142:"COMPOUND_ASSIGN"},productions_:[0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[8,1],[12,2],[12,2],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[14,2],[14,3],[30,1],[32,1],[32,1],[35,1],[35,1],[35,1],[35,1],[35,1],[35,1],[35,1],[19,3],[19,4],[19,5],[44,1],[44,3],[44,5],[44,1],[45,1],[45,1],[45,1],[9,2],[9,1],[10,1],[17,5],[17,2],[53,1],[53,1],[56,0],[56,1],[51,0],[51,1],[51,3],[51,4],[51,6],[58,1],[58,2],[58,3],[59,1],[59,1],[59,1],[59,1],[63,2],[64,1],[64,2],[64,2],[64,1],[42,1],[42,1],[42,1],[15,1],[15,1],[15,1],[15,1],[15,1],[65,2],[65,2],[65,2],[65,2],[65,2],[65,1],[65,1],[73,3],[73,2],[75,1],[75,1],[62,4],[80,0],[80,1],[80,3],[80,4],[80,6],[25,1],[25,2],[25,3],[25,4],[25,2],[25,3],[25,4],[25,5],[16,3],[16,3],[16,1],[16,2],[27,2],[84,0],[84,1],[85,2],[85,4],[68,1],[68,1],[47,2],[61,2],[61,4],[96,1],[96,1],[67,5],[78,3],[78,2],[78,2],[78,1],[91,1],[91,3],[91,4],[91,4],[91,6],[98,1],[98,1],[99,1],[99,3],[21,2],[21,3],[21,4],[21,5],[101,3],[101,3],[101,2],[26,2],[66,3],[66,5],[107,2],[107,4],[107,2],[107,4],[22,2],[22,2],[22,2],[22,1],[111,2],[111,2],[23,2],[23,2],[23,2],[113,2],[113,2],[115,2],[115,3],[119,1],[119,1],[119,1],[119,1],[117,1],[117,3],[116,2],[116,2],[116,4],[116,4],[116,4],[116,6],[116,6],[24,5],[24,7],[24,4],[24,6],[124,1],[124,2],[126,3],[126,4],[128,3],[128,5],[20,1],[20,3],[20,3],[20,3],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,5],[18,4],[18,3]],performAction:function(e,t,n,i,s,r,o){var a=r.length-1;switch(s){case 1:return this.$=i.addLocationDataFn(o[a],o[a])(new i.Block);case 2:return this.$=r[a];case 3:this.$=i.addLocationDataFn(o[a],o[a])(i.Block.wrap([r[a]]));break;case 4:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].push(r[a]));break;case 5:this.$=r[a-1];break;case 6:this.$=r[a];break;case 7:this.$=r[a];break;case 8:this.$=r[a];break;case 9:this.$=r[a];break;case 10:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 11:this.$=r[a];break;case 12:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Await(r[a]));break;case 13:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Await(i.Block.wrap([r[a]])));break;case 14:this.$=r[a];break;case 15:this.$=r[a];break;case 16:this.$=r[a];break;case 17:this.$=r[a];break;case 18:this.$=r[a];break;case 19:this.$=r[a];break;case 20:this.$=r[a];break;case 21:this.$=r[a];break;case 22:this.$=r[a];break;case 23:this.$=r[a];break;case 24:this.$=r[a];break;case 25:this.$=r[a];break;case 26:this.$=r[a];break;case 27:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Block);break;case 28:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-1]);break;case 29:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 30:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 31:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 32:this.$=r[a];break;case 33:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 34:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 35:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(r[a]));break;case 36:this.$=i.addLocationDataFn(o[a],o[a])(new i.Undefined);break;case 37:this.$=i.addLocationDataFn(o[a],o[a])(new i.Null);break;case 38:this.$=i.addLocationDataFn(o[a],o[a])(new i.Bool(r[a]));break;case 39:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(r[a-2],r[a]));break;case 40:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(r[a-3],r[a]));break;case 41:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(r[a-4],r[a-1]));break;case 42:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 43:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(i.addLocationDataFn(o[a-2])(new i.Value(r[a-2])),r[a],"object"));
break;case 44:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(i.addLocationDataFn(o[a-4])(new i.Value(r[a-4])),r[a-1],"object"));break;case 45:this.$=r[a];break;case 46:this.$=r[a];break;case 47:this.$=r[a];break;case 48:this.$=r[a];break;case 49:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Return(r[a]));break;case 50:this.$=i.addLocationDataFn(o[a],o[a])(new i.Return);break;case 51:this.$=i.addLocationDataFn(o[a],o[a])(new i.Comment(r[a]));break;case 52:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Code(r[a-3],r[a],r[a-1]));break;case 53:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Code([],r[a],r[a-1]));break;case 54:this.$=i.addLocationDataFn(o[a],o[a])("func");break;case 55:this.$=i.addLocationDataFn(o[a],o[a])("boundfunc");break;case 56:this.$=r[a];break;case 57:this.$=r[a];break;case 58:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 59:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 60:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].concat(r[a]));break;case 61:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-3].concat(r[a]));break;case 62:this.$=i.addLocationDataFn(o[a-5],o[a])(r[a-5].concat(r[a-2]));break;case 63:this.$=i.addLocationDataFn(o[a],o[a])(new i.Param(r[a]));break;case 64:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Param(r[a-1],null,!0));break;case 65:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Param(r[a-2],r[a]));break;case 66:this.$=r[a];break;case 67:this.$=r[a];break;case 68:this.$=r[a];break;case 69:this.$=r[a];break;case 70:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Splat(r[a-1]));break;case 71:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 72:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a-1].add(r[a]));break;case 73:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(r[a-1],[].concat(r[a])));break;case 74:this.$=r[a];break;case 75:this.$=r[a];break;case 76:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 77:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 78:this.$=r[a];break;case 79:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 80:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 81:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 82:this.$=r[a];break;case 83:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(r[a]));break;case 84:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(r[a].setCustom()));break;case 85:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(r[a],"soak"));break;case 86:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"))),i.addLocationDataFn(o[a])(new i.Access(r[a]))]);break;case 87:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"),"soak")),i.addLocationDataFn(o[a])(new i.Access(r[a]))]);break;case 88:this.$=i.addLocationDataFn(o[a],o[a])(new i.Access(new i.Literal("prototype")));break;case 89:this.$=r[a];break;case 90:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-1]);break;case 91:this.$=i.addLocationDataFn(o[a-1],o[a])(i.extend(r[a],{soak:!0}));break;case 92:this.$=i.addLocationDataFn(o[a],o[a])(new i.Index(r[a]));break;case 93:this.$=i.addLocationDataFn(o[a],o[a])(new i.Slice(r[a]));break;case 94:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Obj(r[a-2],r[a-3].generated));break;case 95:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 96:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 97:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].concat(r[a]));break;case 98:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-3].concat(r[a]));break;case 99:this.$=i.addLocationDataFn(o[a-5],o[a])(r[a-5].concat(r[a-2]));break;case 100:this.$=i.addLocationDataFn(o[a],o[a])(new i.Class);break;case 101:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(null,null,r[a]));break;case 102:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(null,r[a]));break;case 103:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(null,r[a-1],r[a]));break;case 104:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(r[a]));break;case 105:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(r[a-1],null,r[a]));break;case 106:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(r[a-2],r[a]));break;case 107:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Class(r[a-3],r[a-1],r[a]));break;case 108:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(r[a-2],r[a],r[a-1]));break;case 109:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(r[a-2],r[a],r[a-1]));break;case 110:this.$=i.addLocationDataFn(o[a],o[a])(new i.Call("super",[new i.Splat(new i.Literal("arguments"))]));break;case 111:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Call("super",r[a]));break;case 112:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Defer(r[a],n));break;case 113:this.$=i.addLocationDataFn(o[a],o[a])(!1);break;case 114:this.$=i.addLocationDataFn(o[a],o[a])(!0);break;case 115:this.$=i.addLocationDataFn(o[a-1],o[a])([]);break;case 116:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-2]);break;case 117:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 118:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 119:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(i.addLocationDataFn(o[a-1])(new i.Literal("this")),[i.addLocationDataFn(o[a])(new i.Access(r[a]))],"this"));break;case 120:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Arr([]));break;case 121:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Arr(r[a-2]));break;case 122:this.$=i.addLocationDataFn(o[a],o[a])("inclusive");break;case 123:this.$=i.addLocationDataFn(o[a],o[a])("exclusive");break;case 124:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Range(r[a-3],r[a-1],r[a-2]));break;case 125:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Range(r[a-2],r[a],r[a-1]));break;case 126:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(r[a-1],null,r[a]));break;case 127:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(null,r[a],r[a-1]));break;case 128:this.$=i.addLocationDataFn(o[a],o[a])(new i.Range(null,null,r[a]));break;case 129:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 130:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].concat(r[a]));break;case 131:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-3].concat(r[a]));break;case 132:this.$=i.addLocationDataFn(o[a-3],o[a])(r[a-2]);break;case 133:this.$=i.addLocationDataFn(o[a-5],o[a])(r[a-5].concat(r[a-2]));break;case 134:this.$=r[a];break;case 135:this.$=r[a];break;case 136:this.$=r[a];break;case 137:this.$=i.addLocationDataFn(o[a-2],o[a])([].concat(r[a-2],r[a]));break;case 138:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Try(r[a]));break;case 139:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Try(r[a-1],r[a][0],r[a][1]));break;case 140:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Try(r[a-2],null,null,r[a]));break;case 141:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Try(r[a-3],r[a-2][0],r[a-2][1],r[a]));break;case 142:this.$=i.addLocationDataFn(o[a-2],o[a])([r[a-1],r[a]]);break;case 143:this.$=i.addLocationDataFn(o[a-2],o[a])([i.addLocationDataFn(o[a-1])(new i.Value(r[a-1])),r[a]]);break;case 144:this.$=i.addLocationDataFn(o[a-1],o[a])([null,r[a]]);break;case 145:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Throw(r[a]));break;case 146:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Parens(r[a-1]));break;case 147:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Parens(r[a-2]));break;case 148:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(r[a]));break;case 149:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(r[a-2],{guard:r[a]}));break;case 150:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(r[a],{invert:!0}));break;case 151:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(r[a-2],{invert:!0,guard:r[a]}));break;case 152:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a-1].addBody(r[a]));break;case 153:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([r[a-1]]))));break;case 154:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([r[a-1]]))));break;case 155:this.$=i.addLocationDataFn(o[a],o[a])(r[a]);break;case 156:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(r[a]));break;case 157:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(i.addLocationDataFn(o[a])(i.Block.wrap([r[a]]))));break;case 158:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(r[a-1],r[a]));break;case 159:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(r[a-1],r[a]));break;case 160:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(r[a],r[a-1]));break;case 161:this.$=i.addLocationDataFn(o[a-1],o[a])({source:i.addLocationDataFn(o[a])(new i.Value(r[a]))});break;case 162:this.$=i.addLocationDataFn(o[a-1],o[a])(function(){return r[a].own=r[a-1].own,r[a].name=r[a-1][0],r[a].index=r[a-1][1],r[a]}());break;case 163:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a]);break;case 164:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return r[a].own=!0,r[a]}());break;case 165:this.$=r[a];break;case 166:this.$=r[a];break;case 167:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 168:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(r[a]));break;case 169:this.$=i.addLocationDataFn(o[a],o[a])([r[a]]);break;case 170:this.$=i.addLocationDataFn(o[a-2],o[a])([r[a-2],r[a]]);break;case 171:this.$=i.addLocationDataFn(o[a-1],o[a])({source:r[a]});break;case 172:this.$=i.addLocationDataFn(o[a-1],o[a])({source:r[a],object:!0});break;case 173:this.$=i.addLocationDataFn(o[a-3],o[a])({source:r[a-2],guard:r[a]});break;case 174:this.$=i.addLocationDataFn(o[a-3],o[a])({source:r[a-2],guard:r[a],object:!0});break;case 175:this.$=i.addLocationDataFn(o[a-3],o[a])({source:r[a-2],step:r[a]});break;case 176:this.$=i.addLocationDataFn(o[a-5],o[a])({source:r[a-4],guard:r[a-2],step:r[a]});break;case 177:this.$=i.addLocationDataFn(o[a-5],o[a])({source:r[a-4],step:r[a-2],guard:r[a]});break;case 178:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Switch(r[a-3],r[a-1]));break;case 179:this.$=i.addLocationDataFn(o[a-6],o[a])(new i.Switch(r[a-5],r[a-3],r[a-1]));break;case 180:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Switch(null,r[a-1]));break;case 181:this.$=i.addLocationDataFn(o[a-5],o[a])(new i.Switch(null,r[a-3],r[a-1]));break;case 182:this.$=r[a];break;case 183:this.$=i.addLocationDataFn(o[a-1],o[a])(r[a-1].concat(r[a]));break;case 184:this.$=i.addLocationDataFn(o[a-2],o[a])([[r[a-1],r[a]]]);break;case 185:this.$=i.addLocationDataFn(o[a-3],o[a])([[r[a-2],r[a-1]]]);break;case 186:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a-1],r[a],{type:r[a-2]}));break;case 187:this.$=i.addLocationDataFn(o[a-4],o[a])(r[a-4].addElse(i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a-1],r[a],{type:r[a-2]}))));break;case 188:this.$=r[a];break;case 189:this.$=i.addLocationDataFn(o[a-2],o[a])(r[a-2].addElse(r[a]));break;case 190:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([r[a-2]])),{type:r[a-1],statement:!0}));break;case 191:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(r[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([r[a-2]])),{type:r[a-1],statement:!0}));break;case 192:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op(r[a-1],r[a]));break;case 193:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("-",r[a]));break;case 194:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("+",r[a]));break;case 195:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",r[a]));break;case 196:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",r[a]));break;case 197:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",r[a-1],null,!0));break;case 198:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",r[a-1],null,!0));break;case 199:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Existence(r[a-1]));break;case 200:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("+",r[a-2],r[a]));break;case 201:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("-",r[a-2],r[a]));break;case 202:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 203:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 204:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 205:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(r[a-1],r[a-2],r[a]));break;case 206:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return"!"===r[a-1].charAt(0)?new i.Op(r[a-1].slice(1),r[a-2],r[a]).invert():new i.Op(r[a-1],r[a-2],r[a])}());break;case 207:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(r[a-2],r[a],r[a-1]));break;case 208:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(r[a-4],r[a-1],r[a-3]));break;case 209:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(r[a-3],r[a],r[a-2]));break;case 210:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Extends(r[a-2],r[a]))}},table:[{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[3]},{1:[2,2],6:[1,76]},{1:[2,3],6:[2,3],29:[2,3],106:[2,3]},{1:[2,6],6:[2,6],29:[2,6],106:[2,6],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,7],6:[2,7],29:[2,7],106:[2,7],107:89,108:[1,67],110:[1,68],113:90,114:[1,70],115:71,130:[1,88]},{1:[2,14],6:[2,14],28:[2,14],29:[2,14],52:[2,14],57:[2,14],60:[2,14],65:92,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],76:[2,14],77:[1,100],81:[2,14],84:91,88:[1,93],89:[2,113],90:[2,14],95:[2,14],97:[2,14],106:[2,14],108:[2,14],109:[2,14],110:[2,14],114:[2,14],122:[2,14],130:[2,14],132:[2,14],133:[2,14],136:[2,14],137:[2,14],138:[2,14],139:[2,14],140:[2,14],141:[2,14]},{1:[2,15],6:[2,15],28:[2,15],29:[2,15],52:[2,15],57:[2,15],60:[2,15],65:102,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],76:[2,15],77:[1,100],81:[2,15],84:101,88:[1,93],89:[2,113],90:[2,15],95:[2,15],97:[2,15],106:[2,15],108:[2,15],109:[2,15],110:[2,15],114:[2,15],122:[2,15],130:[2,15],132:[2,15],133:[2,15],136:[2,15],137:[2,15],138:[2,15],139:[2,15],140:[2,15],141:[2,15]},{1:[2,16],6:[2,16],28:[2,16],29:[2,16],52:[2,16],57:[2,16],60:[2,16],76:[2,16],81:[2,16],90:[2,16],95:[2,16],97:[2,16],106:[2,16],108:[2,16],109:[2,16],110:[2,16],114:[2,16],122:[2,16],130:[2,16],132:[2,16],133:[2,16],136:[2,16],137:[2,16],138:[2,16],139:[2,16],140:[2,16],141:[2,16]},{1:[2,17],6:[2,17],28:[2,17],29:[2,17],52:[2,17],57:[2,17],60:[2,17],76:[2,17],81:[2,17],90:[2,17],95:[2,17],97:[2,17],106:[2,17],108:[2,17],109:[2,17],110:[2,17],114:[2,17],122:[2,17],130:[2,17],132:[2,17],133:[2,17],136:[2,17],137:[2,17],138:[2,17],139:[2,17],140:[2,17],141:[2,17]},{1:[2,18],6:[2,18],28:[2,18],29:[2,18],52:[2,18],57:[2,18],60:[2,18],76:[2,18],81:[2,18],90:[2,18],95:[2,18],97:[2,18],106:[2,18],108:[2,18],109:[2,18],110:[2,18],114:[2,18],122:[2,18],130:[2,18],132:[2,18],133:[2,18],136:[2,18],137:[2,18],138:[2,18],139:[2,18],140:[2,18],141:[2,18]},{1:[2,19],6:[2,19],28:[2,19],29:[2,19],52:[2,19],57:[2,19],60:[2,19],76:[2,19],81:[2,19],90:[2,19],95:[2,19],97:[2,19],106:[2,19],108:[2,19],109:[2,19],110:[2,19],114:[2,19],122:[2,19],130:[2,19],132:[2,19],133:[2,19],136:[2,19],137:[2,19],138:[2,19],139:[2,19],140:[2,19],141:[2,19]},{1:[2,20],6:[2,20],28:[2,20],29:[2,20],52:[2,20],57:[2,20],60:[2,20],76:[2,20],81:[2,20],90:[2,20],95:[2,20],97:[2,20],106:[2,20],108:[2,20],109:[2,20],110:[2,20],114:[2,20],122:[2,20],130:[2,20],132:[2,20],133:[2,20],136:[2,20],137:[2,20],138:[2,20],139:[2,20],140:[2,20],141:[2,20]},{1:[2,21],6:[2,21],28:[2,21],29:[2,21],52:[2,21],57:[2,21],60:[2,21],76:[2,21],81:[2,21],90:[2,21],95:[2,21],97:[2,21],106:[2,21],108:[2,21],109:[2,21],110:[2,21],114:[2,21],122:[2,21],130:[2,21],132:[2,21],133:[2,21],136:[2,21],137:[2,21],138:[2,21],139:[2,21],140:[2,21],141:[2,21]},{1:[2,22],6:[2,22],28:[2,22],29:[2,22],52:[2,22],57:[2,22],60:[2,22],76:[2,22],81:[2,22],90:[2,22],95:[2,22],97:[2,22],106:[2,22],108:[2,22],109:[2,22],110:[2,22],114:[2,22],122:[2,22],130:[2,22],132:[2,22],133:[2,22],136:[2,22],137:[2,22],138:[2,22],139:[2,22],140:[2,22],141:[2,22]},{1:[2,23],6:[2,23],28:[2,23],29:[2,23],52:[2,23],57:[2,23],60:[2,23],76:[2,23],81:[2,23],90:[2,23],95:[2,23],97:[2,23],106:[2,23],108:[2,23],109:[2,23],110:[2,23],114:[2,23],122:[2,23],130:[2,23],132:[2,23],133:[2,23],136:[2,23],137:[2,23],138:[2,23],139:[2,23],140:[2,23],141:[2,23]},{1:[2,24],6:[2,24],28:[2,24],29:[2,24],52:[2,24],57:[2,24],60:[2,24],76:[2,24],81:[2,24],90:[2,24],95:[2,24],97:[2,24],106:[2,24],108:[2,24],109:[2,24],110:[2,24],114:[2,24],122:[2,24],130:[2,24],132:[2,24],133:[2,24],136:[2,24],137:[2,24],138:[2,24],139:[2,24],140:[2,24],141:[2,24]},{1:[2,25],6:[2,25],28:[2,25],29:[2,25],52:[2,25],57:[2,25],60:[2,25],76:[2,25],81:[2,25],90:[2,25],95:[2,25],97:[2,25],106:[2,25],108:[2,25],109:[2,25],110:[2,25],114:[2,25],122:[2,25],130:[2,25],132:[2,25],133:[2,25],136:[2,25],137:[2,25],138:[2,25],139:[2,25],140:[2,25],141:[2,25]},{1:[2,26],6:[2,26],28:[2,26],29:[2,26],52:[2,26],57:[2,26],60:[2,26],76:[2,26],81:[2,26],90:[2,26],95:[2,26],97:[2,26],106:[2,26],108:[2,26],109:[2,26],110:[2,26],114:[2,26],122:[2,26],130:[2,26],132:[2,26],133:[2,26],136:[2,26],137:[2,26],138:[2,26],139:[2,26],140:[2,26],141:[2,26]},{1:[2,8],6:[2,8],29:[2,8],106:[2,8],108:[2,8],110:[2,8],114:[2,8],130:[2,8]},{1:[2,9],6:[2,9],29:[2,9],106:[2,9],108:[2,9],110:[2,9],114:[2,9],130:[2,9]},{1:[2,10],6:[2,10],29:[2,10],106:[2,10],108:[2,10],110:[2,10],114:[2,10],130:[2,10]},{1:[2,11],6:[2,11],29:[2,11],106:[2,11],108:[2,11],110:[2,11],114:[2,11],130:[2,11]},{1:[2,78],6:[2,78],28:[2,78],29:[2,78],43:[1,103],52:[2,78],57:[2,78],60:[2,78],69:[2,78],70:[2,78],71:[2,78],72:[2,78],74:[2,78],76:[2,78],77:[2,78],81:[2,78],88:[2,78],89:[2,78],90:[2,78],95:[2,78],97:[2,78],106:[2,78],108:[2,78],109:[2,78],110:[2,78],114:[2,78],122:[2,78],130:[2,78],132:[2,78],133:[2,78],136:[2,78],137:[2,78],138:[2,78],139:[2,78],140:[2,78],141:[2,78]},{1:[2,79],6:[2,79],28:[2,79],29:[2,79],52:[2,79],57:[2,79],60:[2,79],69:[2,79],70:[2,79],71:[2,79],72:[2,79],74:[2,79],76:[2,79],77:[2,79],81:[2,79],88:[2,79],89:[2,79],90:[2,79],95:[2,79],97:[2,79],106:[2,79],108:[2,79],109:[2,79],110:[2,79],114:[2,79],122:[2,79],130:[2,79],132:[2,79],133:[2,79],136:[2,79],137:[2,79],138:[2,79],139:[2,79],140:[2,79],141:[2,79]},{1:[2,80],6:[2,80],28:[2,80],29:[2,80],52:[2,80],57:[2,80],60:[2,80],69:[2,80],70:[2,80],71:[2,80],72:[2,80],74:[2,80],76:[2,80],77:[2,80],81:[2,80],88:[2,80],89:[2,80],90:[2,80],95:[2,80],97:[2,80],106:[2,80],108:[2,80],109:[2,80],110:[2,80],114:[2,80],122:[2,80],130:[2,80],132:[2,80],133:[2,80],136:[2,80],137:[2,80],138:[2,80],139:[2,80],140:[2,80],141:[2,80]},{1:[2,81],6:[2,81],28:[2,81],29:[2,81],52:[2,81],57:[2,81],60:[2,81],69:[2,81],70:[2,81],71:[2,81],72:[2,81],74:[2,81],76:[2,81],77:[2,81],81:[2,81],88:[2,81],89:[2,81],90:[2,81],95:[2,81],97:[2,81],106:[2,81],108:[2,81],109:[2,81],110:[2,81],114:[2,81],122:[2,81],130:[2,81],132:[2,81],133:[2,81],136:[2,81],137:[2,81],138:[2,81],139:[2,81],140:[2,81],141:[2,81]},{1:[2,82],6:[2,82],28:[2,82],29:[2,82],52:[2,82],57:[2,82],60:[2,82],69:[2,82],70:[2,82],71:[2,82],72:[2,82],74:[2,82],76:[2,82],77:[2,82],81:[2,82],88:[2,82],89:[2,82],90:[2,82],95:[2,82],97:[2,82],106:[2,82],108:[2,82],109:[2,82],110:[2,82],114:[2,82],122:[2,82],130:[2,82],132:[2,82],133:[2,82],136:[2,82],137:[2,82],138:[2,82],139:[2,82],140:[2,82],141:[2,82]},{1:[2,110],6:[2,110],28:[2,110],29:[2,110],52:[2,110],57:[2,110],60:[2,110],69:[2,110],70:[2,110],71:[2,110],72:[2,110],74:[2,110],76:[2,110],77:[2,110],81:[2,110],85:104,88:[2,110],89:[1,105],90:[2,110],95:[2,110],97:[2,110],106:[2,110],108:[2,110],109:[2,110],110:[2,110],114:[2,110],122:[2,110],130:[2,110],132:[2,110],133:[2,110],136:[2,110],137:[2,110],138:[2,110],139:[2,110],140:[2,110],141:[2,110]},{6:[2,58],28:[2,58],30:109,31:[1,75],47:110,51:106,52:[2,58],57:[2,58],58:107,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{14:115,28:[1,116]},{7:117,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:119,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:120,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{15:122,16:123,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:124,47:65,61:49,62:50,64:121,66:25,67:26,68:27,79:[1,72],86:[1,28],92:[1,60],93:[1,61],94:[1,59],105:[1,58]},{15:122,16:123,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:124,47:65,61:49,62:50,64:125,66:25,67:26,68:27,79:[1,72],86:[1,28],92:[1,60],93:[1,61],94:[1,59],105:[1,58]},{1:[2,75],6:[2,75],28:[2,75],29:[2,75],43:[2,75],52:[2,75],57:[2,75],60:[2,75],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,75],77:[2,75],81:[2,75],83:[1,129],88:[2,75],89:[2,75],90:[2,75],95:[2,75],97:[2,75],106:[2,75],108:[2,75],109:[2,75],110:[2,75],114:[2,75],122:[2,75],130:[2,75],132:[2,75],133:[2,75],134:[1,126],135:[1,127],136:[2,75],137:[2,75],138:[2,75],139:[2,75],140:[2,75],141:[2,75],142:[1,128]},{1:[2,188],6:[2,188],28:[2,188],29:[2,188],52:[2,188],57:[2,188],60:[2,188],76:[2,188],81:[2,188],90:[2,188],95:[2,188],97:[2,188],106:[2,188],108:[2,188],109:[2,188],110:[2,188],114:[2,188],122:[2,188],125:[1,130],130:[2,188],132:[2,188],133:[2,188],136:[2,188],137:[2,188],138:[2,188],139:[2,188],140:[2,188],141:[2,188]},{14:131,28:[1,116]},{14:132,28:[1,116]},{1:[2,155],6:[2,155],28:[2,155],29:[2,155],52:[2,155],57:[2,155],60:[2,155],76:[2,155],81:[2,155],90:[2,155],95:[2,155],97:[2,155],106:[2,155],108:[2,155],109:[2,155],110:[2,155],114:[2,155],122:[2,155],130:[2,155],132:[2,155],133:[2,155],136:[2,155],137:[2,155],138:[2,155],139:[2,155],140:[2,155],141:[2,155]},{14:133,28:[1,116]},{7:134,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,135],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,100],6:[2,100],14:136,15:122,16:123,28:[1,116],29:[2,100],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:124,47:65,52:[2,100],57:[2,100],60:[2,100],61:49,62:50,64:138,66:25,67:26,68:27,76:[2,100],79:[1,72],81:[2,100],83:[1,137],86:[1,28],90:[2,100],92:[1,60],93:[1,61],94:[1,59],95:[2,100],97:[2,100],105:[1,58],106:[2,100],108:[2,100],109:[2,100],110:[2,100],114:[2,100],122:[2,100],130:[2,100],132:[2,100],133:[2,100],136:[2,100],137:[2,100],138:[2,100],139:[2,100],140:[2,100],141:[2,100]},{7:139,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{85:140,89:[1,105]},{1:[2,50],6:[2,50],7:141,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,29:[2,50],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],106:[2,50],107:39,108:[2,50],110:[2,50],111:40,112:[1,69],113:41,114:[2,50],115:71,123:[1,42],128:37,129:[1,66],130:[2,50],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,51],6:[2,51],28:[2,51],29:[2,51],57:[2,51],81:[2,51],106:[2,51],108:[2,51],110:[2,51],114:[2,51],130:[2,51]},{7:143,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],14:142,15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,116],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,76],6:[2,76],28:[2,76],29:[2,76],43:[2,76],52:[2,76],57:[2,76],60:[2,76],69:[2,76],70:[2,76],71:[2,76],72:[2,76],74:[2,76],76:[2,76],77:[2,76],81:[2,76],88:[2,76],89:[2,76],90:[2,76],95:[2,76],97:[2,76],106:[2,76],108:[2,76],109:[2,76],110:[2,76],114:[2,76],122:[2,76],130:[2,76],132:[2,76],133:[2,76],136:[2,76],137:[2,76],138:[2,76],139:[2,76],140:[2,76],141:[2,76]},{1:[2,77],6:[2,77],28:[2,77],29:[2,77],43:[2,77],52:[2,77],57:[2,77],60:[2,77],69:[2,77],70:[2,77],71:[2,77],72:[2,77],74:[2,77],76:[2,77],77:[2,77],81:[2,77],88:[2,77],89:[2,77],90:[2,77],95:[2,77],97:[2,77],106:[2,77],108:[2,77],109:[2,77],110:[2,77],114:[2,77],122:[2,77],130:[2,77],132:[2,77],133:[2,77],136:[2,77],137:[2,77],138:[2,77],139:[2,77],140:[2,77],141:[2,77]},{1:[2,32],6:[2,32],28:[2,32],29:[2,32],52:[2,32],57:[2,32],60:[2,32],69:[2,32],70:[2,32],71:[2,32],72:[2,32],74:[2,32],76:[2,32],77:[2,32],81:[2,32],88:[2,32],89:[2,32],90:[2,32],95:[2,32],97:[2,32],106:[2,32],108:[2,32],109:[2,32],110:[2,32],114:[2,32],122:[2,32],130:[2,32],132:[2,32],133:[2,32],136:[2,32],137:[2,32],138:[2,32],139:[2,32],140:[2,32],141:[2,32]},{1:[2,33],6:[2,33],28:[2,33],29:[2,33],52:[2,33],57:[2,33],60:[2,33],69:[2,33],70:[2,33],71:[2,33],72:[2,33],74:[2,33],76:[2,33],77:[2,33],81:[2,33],88:[2,33],89:[2,33],90:[2,33],95:[2,33],97:[2,33],106:[2,33],108:[2,33],109:[2,33],110:[2,33],114:[2,33],122:[2,33],130:[2,33],132:[2,33],133:[2,33],136:[2,33],137:[2,33],138:[2,33],139:[2,33],140:[2,33],141:[2,33]},{1:[2,34],6:[2,34],28:[2,34],29:[2,34],52:[2,34],57:[2,34],60:[2,34],69:[2,34],70:[2,34],71:[2,34],72:[2,34],74:[2,34],76:[2,34],77:[2,34],81:[2,34],88:[2,34],89:[2,34],90:[2,34],95:[2,34],97:[2,34],106:[2,34],108:[2,34],109:[2,34],110:[2,34],114:[2,34],122:[2,34],130:[2,34],132:[2,34],133:[2,34],136:[2,34],137:[2,34],138:[2,34],139:[2,34],140:[2,34],141:[2,34]},{1:[2,35],6:[2,35],28:[2,35],29:[2,35],52:[2,35],57:[2,35],60:[2,35],69:[2,35],70:[2,35],71:[2,35],72:[2,35],74:[2,35],76:[2,35],77:[2,35],81:[2,35],88:[2,35],89:[2,35],90:[2,35],95:[2,35],97:[2,35],106:[2,35],108:[2,35],109:[2,35],110:[2,35],114:[2,35],122:[2,35],130:[2,35],132:[2,35],133:[2,35],136:[2,35],137:[2,35],138:[2,35],139:[2,35],140:[2,35],141:[2,35]},{1:[2,36],6:[2,36],28:[2,36],29:[2,36],52:[2,36],57:[2,36],60:[2,36],69:[2,36],70:[2,36],71:[2,36],72:[2,36],74:[2,36],76:[2,36],77:[2,36],81:[2,36],88:[2,36],89:[2,36],90:[2,36],95:[2,36],97:[2,36],106:[2,36],108:[2,36],109:[2,36],110:[2,36],114:[2,36],122:[2,36],130:[2,36],132:[2,36],133:[2,36],136:[2,36],137:[2,36],138:[2,36],139:[2,36],140:[2,36],141:[2,36]},{1:[2,37],6:[2,37],28:[2,37],29:[2,37],52:[2,37],57:[2,37],60:[2,37],69:[2,37],70:[2,37],71:[2,37],72:[2,37],74:[2,37],76:[2,37],77:[2,37],81:[2,37],88:[2,37],89:[2,37],90:[2,37],95:[2,37],97:[2,37],106:[2,37],108:[2,37],109:[2,37],110:[2,37],114:[2,37],122:[2,37],130:[2,37],132:[2,37],133:[2,37],136:[2,37],137:[2,37],138:[2,37],139:[2,37],140:[2,37],141:[2,37]},{1:[2,38],6:[2,38],28:[2,38],29:[2,38],52:[2,38],57:[2,38],60:[2,38],69:[2,38],70:[2,38],71:[2,38],72:[2,38],74:[2,38],76:[2,38],77:[2,38],81:[2,38],88:[2,38],89:[2,38],90:[2,38],95:[2,38],97:[2,38],106:[2,38],108:[2,38],109:[2,38],110:[2,38],114:[2,38],122:[2,38],130:[2,38],132:[2,38],133:[2,38],136:[2,38],137:[2,38],138:[2,38],139:[2,38],140:[2,38],141:[2,38]},{4:144,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,145],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:146,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:148,92:[1,60],93:[1,61],94:[1,59],95:[1,147],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,117],6:[2,117],28:[2,117],29:[2,117],52:[2,117],57:[2,117],60:[2,117],69:[2,117],70:[2,117],71:[2,117],72:[2,117],74:[2,117],76:[2,117],77:[2,117],81:[2,117],88:[2,117],89:[2,117],90:[2,117],95:[2,117],97:[2,117],106:[2,117],108:[2,117],109:[2,117],110:[2,117],114:[2,117],122:[2,117],130:[2,117],132:[2,117],133:[2,117],136:[2,117],137:[2,117],138:[2,117],139:[2,117],140:[2,117],141:[2,117]},{1:[2,118],6:[2,118],28:[2,118],29:[2,118],30:152,31:[1,75],52:[2,118],57:[2,118],60:[2,118],69:[2,118],70:[2,118],71:[2,118],72:[2,118],74:[2,118],76:[2,118],77:[2,118],81:[2,118],88:[2,118],89:[2,118],90:[2,118],95:[2,118],97:[2,118],106:[2,118],108:[2,118],109:[2,118],110:[2,118],114:[2,118],122:[2,118],130:[2,118],132:[2,118],133:[2,118],136:[2,118],137:[2,118],138:[2,118],139:[2,118],140:[2,118],141:[2,118]},{28:[2,54]},{28:[2,55]},{1:[2,71],6:[2,71],28:[2,71],29:[2,71],43:[2,71],52:[2,71],57:[2,71],60:[2,71],69:[2,71],70:[2,71],71:[2,71],72:[2,71],74:[2,71],76:[2,71],77:[2,71],81:[2,71],83:[2,71],88:[2,71],89:[2,71],90:[2,71],95:[2,71],97:[2,71],106:[2,71],108:[2,71],109:[2,71],110:[2,71],114:[2,71],122:[2,71],130:[2,71],132:[2,71],133:[2,71],134:[2,71],135:[2,71],136:[2,71],137:[2,71],138:[2,71],139:[2,71],140:[2,71],141:[2,71],142:[2,71]},{1:[2,74],6:[2,74],28:[2,74],29:[2,74],43:[2,74],52:[2,74],57:[2,74],60:[2,74],69:[2,74],70:[2,74],71:[2,74],72:[2,74],74:[2,74],76:[2,74],77:[2,74],81:[2,74],83:[2,74],88:[2,74],89:[2,74],90:[2,74],95:[2,74],97:[2,74],106:[2,74],108:[2,74],109:[2,74],110:[2,74],114:[2,74],122:[2,74],130:[2,74],132:[2,74],133:[2,74],134:[2,74],135:[2,74],136:[2,74],137:[2,74],138:[2,74],139:[2,74],140:[2,74],141:[2,74],142:[2,74]},{7:153,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:154,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:155,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:157,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],14:156,15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,116],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{30:162,31:[1,75],47:163,61:164,62:165,67:158,79:[1,72],93:[1,113],94:[1,59],117:159,118:[1,160],119:161},{116:166,120:[1,167],121:[1,168]},{6:[2,95],10:172,28:[2,95],30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:170,45:171,47:175,49:[1,47],57:[2,95],80:169,81:[2,95],93:[1,113]},{1:[2,30],6:[2,30],28:[2,30],29:[2,30],46:[2,30],52:[2,30],57:[2,30],60:[2,30],69:[2,30],70:[2,30],71:[2,30],72:[2,30],74:[2,30],76:[2,30],77:[2,30],81:[2,30],88:[2,30],89:[2,30],90:[2,30],95:[2,30],97:[2,30],106:[2,30],108:[2,30],109:[2,30],110:[2,30],114:[2,30],122:[2,30],130:[2,30],132:[2,30],133:[2,30],136:[2,30],137:[2,30],138:[2,30],139:[2,30],140:[2,30],141:[2,30]},{1:[2,31],6:[2,31],28:[2,31],29:[2,31],46:[2,31],52:[2,31],57:[2,31],60:[2,31],69:[2,31],70:[2,31],71:[2,31],72:[2,31],74:[2,31],76:[2,31],77:[2,31],81:[2,31],88:[2,31],89:[2,31],90:[2,31],95:[2,31],97:[2,31],106:[2,31],108:[2,31],109:[2,31],110:[2,31],114:[2,31],122:[2,31],130:[2,31],132:[2,31],133:[2,31],136:[2,31],137:[2,31],138:[2,31],139:[2,31],140:[2,31],141:[2,31]},{1:[2,29],6:[2,29],28:[2,29],29:[2,29],43:[2,29],46:[2,29],52:[2,29],57:[2,29],60:[2,29],69:[2,29],70:[2,29],71:[2,29],72:[2,29],74:[2,29],76:[2,29],77:[2,29],81:[2,29],83:[2,29],88:[2,29],89:[2,29],90:[2,29],95:[2,29],97:[2,29],106:[2,29],108:[2,29],109:[2,29],110:[2,29],114:[2,29],120:[2,29],121:[2,29],122:[2,29],130:[2,29],132:[2,29],133:[2,29],134:[2,29],135:[2,29],136:[2,29],137:[2,29],138:[2,29],139:[2,29],140:[2,29],141:[2,29],142:[2,29]},{1:[2,5],5:176,6:[2,5],7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,29:[2,5],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],106:[2,5],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,199],6:[2,199],28:[2,199],29:[2,199],52:[2,199],57:[2,199],60:[2,199],76:[2,199],81:[2,199],90:[2,199],95:[2,199],97:[2,199],106:[2,199],108:[2,199],109:[2,199],110:[2,199],114:[2,199],122:[2,199],130:[2,199],132:[2,199],133:[2,199],136:[2,199],137:[2,199],138:[2,199],139:[2,199],140:[2,199],141:[2,199]},{7:177,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:178,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:179,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:180,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:181,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:182,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:183,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:184,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,154],6:[2,154],28:[2,154],29:[2,154],52:[2,154],57:[2,154],60:[2,154],76:[2,154],81:[2,154],90:[2,154],95:[2,154],97:[2,154],106:[2,154],108:[2,154],109:[2,154],110:[2,154],114:[2,154],122:[2,154],130:[2,154],132:[2,154],133:[2,154],136:[2,154],137:[2,154],138:[2,154],139:[2,154],140:[2,154],141:[2,154]},{1:[2,159],6:[2,159],28:[2,159],29:[2,159],52:[2,159],57:[2,159],60:[2,159],76:[2,159],81:[2,159],90:[2,159],95:[2,159],97:[2,159],106:[2,159],108:[2,159],109:[2,159],110:[2,159],114:[2,159],122:[2,159],130:[2,159],132:[2,159],133:[2,159],136:[2,159],137:[2,159],138:[2,159],139:[2,159],140:[2,159],141:[2,159]},{7:185,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,153],6:[2,153],28:[2,153],29:[2,153],52:[2,153],57:[2,153],60:[2,153],76:[2,153],81:[2,153],90:[2,153],95:[2,153],97:[2,153],106:[2,153],108:[2,153],109:[2,153],110:[2,153],114:[2,153],122:[2,153],130:[2,153],132:[2,153],133:[2,153],136:[2,153],137:[2,153],138:[2,153],139:[2,153],140:[2,153],141:[2,153]},{1:[2,158],6:[2,158],28:[2,158],29:[2,158],52:[2,158],57:[2,158],60:[2,158],76:[2,158],81:[2,158],90:[2,158],95:[2,158],97:[2,158],106:[2,158],108:[2,158],109:[2,158],110:[2,158],114:[2,158],122:[2,158],130:[2,158],132:[2,158],133:[2,158],136:[2,158],137:[2,158],138:[2,158],139:[2,158],140:[2,158],141:[2,158]},{85:186,89:[1,105]},{1:[2,72],6:[2,72],28:[2,72],29:[2,72],43:[2,72],52:[2,72],57:[2,72],60:[2,72],69:[2,72],70:[2,72],71:[2,72],72:[2,72],74:[2,72],76:[2,72],77:[2,72],81:[2,72],83:[2,72],88:[2,72],89:[2,72],90:[2,72],95:[2,72],97:[2,72],106:[2,72],108:[2,72],109:[2,72],110:[2,72],114:[2,72],122:[2,72],130:[2,72],132:[2,72],133:[2,72],134:[2,72],135:[2,72],136:[2,72],137:[2,72],138:[2,72],139:[2,72],140:[2,72],141:[2,72],142:[2,72]},{89:[2,114]},{27:188,30:187,31:[1,75],87:[1,45]},{30:189,31:[1,75]},{1:[2,88],6:[2,88],28:[2,88],29:[2,88],30:190,31:[1,75],43:[2,88],52:[2,88],57:[2,88],60:[2,88],69:[2,88],70:[2,88],71:[2,88],72:[2,88],74:[2,88],76:[2,88],77:[2,88],81:[2,88],83:[2,88],88:[2,88],89:[2,88],90:[2,88],95:[2,88],97:[2,88],106:[2,88],108:[2,88],109:[2,88],110:[2,88],114:[2,88],122:[2,88],130:[2,88],132:[2,88],133:[2,88],134:[2,88],135:[2,88],136:[2,88],137:[2,88],138:[2,88],139:[2,88],140:[2,88],141:[2,88],142:[2,88]},{30:191,31:[1,75]},{1:[2,89],6:[2,89],28:[2,89],29:[2,89],43:[2,89],52:[2,89],57:[2,89],60:[2,89],69:[2,89],70:[2,89],71:[2,89],72:[2,89],74:[2,89],76:[2,89],77:[2,89],81:[2,89],83:[2,89],88:[2,89],89:[2,89],90:[2,89],95:[2,89],97:[2,89],106:[2,89],108:[2,89],109:[2,89],110:[2,89],114:[2,89],122:[2,89],130:[2,89],132:[2,89],133:[2,89],134:[2,89],135:[2,89],136:[2,89],137:[2,89],138:[2,89],139:[2,89],140:[2,89],141:[2,89],142:[2,89]},{7:193,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],60:[1,197],61:49,62:50,64:36,66:25,67:26,68:27,75:192,78:194,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],96:195,97:[1,196],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{73:198,74:[1,99],77:[1,100]},{85:199,89:[1,105]},{1:[2,73],6:[2,73],28:[2,73],29:[2,73],43:[2,73],52:[2,73],57:[2,73],60:[2,73],69:[2,73],70:[2,73],71:[2,73],72:[2,73],74:[2,73],76:[2,73],77:[2,73],81:[2,73],83:[2,73],88:[2,73],89:[2,73],90:[2,73],95:[2,73],97:[2,73],106:[2,73],108:[2,73],109:[2,73],110:[2,73],114:[2,73],122:[2,73],130:[2,73],132:[2,73],133:[2,73],134:[2,73],135:[2,73],136:[2,73],137:[2,73],138:[2,73],139:[2,73],140:[2,73],141:[2,73],142:[2,73]},{6:[1,201],7:200,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,202],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,111],6:[2,111],28:[2,111],29:[2,111],52:[2,111],57:[2,111],60:[2,111],69:[2,111],70:[2,111],71:[2,111],72:[2,111],74:[2,111],76:[2,111],77:[2,111],81:[2,111],88:[2,111],89:[2,111],90:[2,111],95:[2,111],97:[2,111],106:[2,111],108:[2,111],109:[2,111],110:[2,111],114:[2,111],122:[2,111],130:[2,111],132:[2,111],133:[2,111],136:[2,111],137:[2,111],138:[2,111],139:[2,111],140:[2,111],141:[2,111]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],90:[1,203],91:204,92:[1,60],93:[1,61],94:[1,59],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,56],28:[2,56],52:[1,206],56:208,57:[1,207]},{6:[2,59],28:[2,59],29:[2,59],52:[2,59],57:[2,59]},{6:[2,63],28:[2,63],29:[2,63],43:[1,210],52:[2,63],57:[2,63],60:[1,209]},{6:[2,66],28:[2,66],29:[2,66],43:[2,66],52:[2,66],57:[2,66],60:[2,66]},{6:[2,67],28:[2,67],29:[2,67],43:[2,67],52:[2,67],57:[2,67],60:[2,67]},{6:[2,68],28:[2,68],29:[2,68],43:[2,68],52:[2,68],57:[2,68],60:[2,68]},{6:[2,69],28:[2,69],29:[2,69],43:[2,69],52:[2,69],57:[2,69],60:[2,69]},{30:152,31:[1,75]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:148,92:[1,60],93:[1,61],94:[1,59],95:[1,147],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,53],6:[2,53],28:[2,53],29:[2,53],52:[2,53],57:[2,53],60:[2,53],76:[2,53],81:[2,53],90:[2,53],95:[2,53],97:[2,53],106:[2,53],108:[2,53],109:[2,53],110:[2,53],114:[2,53],122:[2,53],130:[2,53],132:[2,53],133:[2,53],136:[2,53],137:[2,53],138:[2,53],139:[2,53],140:[2,53],141:[2,53]},{4:212,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,29:[1,211],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,192],6:[2,192],28:[2,192],29:[2,192],52:[2,192],57:[2,192],60:[2,192],76:[2,192],81:[2,192],90:[2,192],95:[2,192],97:[2,192],106:[2,192],107:86,108:[2,192],109:[2,192],110:[2,192],113:87,114:[2,192],115:71,122:[2,192],130:[2,192],132:[2,192],133:[2,192],136:[1,77],137:[2,192],138:[2,192],139:[2,192],140:[2,192],141:[2,192]},{107:89,108:[1,67],110:[1,68],113:90,114:[1,70],115:71,130:[1,88]},{1:[2,193],6:[2,193],28:[2,193],29:[2,193],52:[2,193],57:[2,193],60:[2,193],76:[2,193],81:[2,193],90:[2,193],95:[2,193],97:[2,193],106:[2,193],107:86,108:[2,193],109:[2,193],110:[2,193],113:87,114:[2,193],115:71,122:[2,193],130:[2,193],132:[2,193],133:[2,193],136:[1,77],137:[2,193],138:[2,193],139:[2,193],140:[2,193],141:[2,193]},{1:[2,194],6:[2,194],28:[2,194],29:[2,194],52:[2,194],57:[2,194],60:[2,194],76:[2,194],81:[2,194],90:[2,194],95:[2,194],97:[2,194],106:[2,194],107:86,108:[2,194],109:[2,194],110:[2,194],113:87,114:[2,194],115:71,122:[2,194],130:[2,194],132:[2,194],133:[2,194],136:[1,77],137:[2,194],138:[2,194],139:[2,194],140:[2,194],141:[2,194]},{1:[2,195],6:[2,195],28:[2,195],29:[2,195],52:[2,195],57:[2,195],60:[2,195],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,195],77:[2,75],81:[2,195],88:[2,75],89:[2,75],90:[2,195],95:[2,195],97:[2,195],106:[2,195],108:[2,195],109:[2,195],110:[2,195],114:[2,195],122:[2,195],130:[2,195],132:[2,195],133:[2,195],136:[2,195],137:[2,195],138:[2,195],139:[2,195],140:[2,195],141:[2,195]},{65:92,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],77:[1,100],84:91,88:[1,93],89:[2,113]},{65:102,69:[1,94],70:[1,95],71:[1,96],72:[1,97],73:98,74:[1,99],77:[1,100],84:101,88:[1,93],89:[2,113]},{69:[2,78],70:[2,78],71:[2,78],72:[2,78],74:[2,78],77:[2,78],88:[2,78],89:[2,78]},{1:[2,196],6:[2,196],28:[2,196],29:[2,196],52:[2,196],57:[2,196],60:[2,196],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,196],77:[2,75],81:[2,196],88:[2,75],89:[2,75],90:[2,196],95:[2,196],97:[2,196],106:[2,196],108:[2,196],109:[2,196],110:[2,196],114:[2,196],122:[2,196],130:[2,196],132:[2,196],133:[2,196],136:[2,196],137:[2,196],138:[2,196],139:[2,196],140:[2,196],141:[2,196]},{1:[2,197],6:[2,197],28:[2,197],29:[2,197],52:[2,197],57:[2,197],60:[2,197],76:[2,197],81:[2,197],90:[2,197],95:[2,197],97:[2,197],106:[2,197],108:[2,197],109:[2,197],110:[2,197],114:[2,197],122:[2,197],130:[2,197],132:[2,197],133:[2,197],136:[2,197],137:[2,197],138:[2,197],139:[2,197],140:[2,197],141:[2,197]},{1:[2,198],6:[2,198],28:[2,198],29:[2,198],52:[2,198],57:[2,198],60:[2,198],76:[2,198],81:[2,198],90:[2,198],95:[2,198],97:[2,198],106:[2,198],108:[2,198],109:[2,198],110:[2,198],114:[2,198],122:[2,198],130:[2,198],132:[2,198],133:[2,198],136:[2,198],137:[2,198],138:[2,198],139:[2,198],140:[2,198],141:[2,198]},{6:[1,215],7:213,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,214],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:216,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{14:217,28:[1,116],129:[1,218]},{1:[2,138],6:[2,138],28:[2,138],29:[2,138],52:[2,138],57:[2,138],60:[2,138],76:[2,138],81:[2,138],90:[2,138],95:[2,138],97:[2,138],101:219,102:[1,220],103:[1,221],106:[2,138],108:[2,138],109:[2,138],110:[2,138],114:[2,138],122:[2,138],130:[2,138],132:[2,138],133:[2,138],136:[2,138],137:[2,138],138:[2,138],139:[2,138],140:[2,138],141:[2,138]},{1:[2,152],6:[2,152],28:[2,152],29:[2,152],52:[2,152],57:[2,152],60:[2,152],76:[2,152],81:[2,152],90:[2,152],95:[2,152],97:[2,152],106:[2,152],108:[2,152],109:[2,152],110:[2,152],114:[2,152],122:[2,152],130:[2,152],132:[2,152],133:[2,152],136:[2,152],137:[2,152],138:[2,152],139:[2,152],140:[2,152],141:[2,152]},{1:[2,160],6:[2,160],28:[2,160],29:[2,160],52:[2,160],57:[2,160],60:[2,160],76:[2,160],81:[2,160],90:[2,160],95:[2,160],97:[2,160],106:[2,160],108:[2,160],109:[2,160],110:[2,160],114:[2,160],122:[2,160],130:[2,160],132:[2,160],133:[2,160],136:[2,160],137:[2,160],138:[2,160],139:[2,160],140:[2,160],141:[2,160]},{28:[1,222],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{124:223,126:224,127:[1,225]},{1:[2,101],6:[2,101],28:[2,101],29:[2,101],52:[2,101],57:[2,101],60:[2,101],76:[2,101],81:[2,101],90:[2,101],95:[2,101],97:[2,101],106:[2,101],108:[2,101],109:[2,101],110:[2,101],114:[2,101],122:[2,101],130:[2,101],132:[2,101],133:[2,101],136:[2,101],137:[2,101],138:[2,101],139:[2,101],140:[2,101],141:[2,101]},{7:226,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,104],6:[2,104],14:227,28:[1,116],29:[2,104],52:[2,104],57:[2,104],60:[2,104],69:[2,75],70:[2,75],71:[2,75],72:[2,75],74:[2,75],76:[2,104],77:[2,75],81:[2,104],83:[1,228],88:[2,75],89:[2,75],90:[2,104],95:[2,104],97:[2,104],106:[2,104],108:[2,104],109:[2,104],110:[2,104],114:[2,104],122:[2,104],130:[2,104],132:[2,104],133:[2,104],136:[2,104],137:[2,104],138:[2,104],139:[2,104],140:[2,104],141:[2,104]},{1:[2,145],6:[2,145],28:[2,145],29:[2,145],52:[2,145],57:[2,145],60:[2,145],76:[2,145],81:[2,145],90:[2,145],95:[2,145],97:[2,145],106:[2,145],107:86,108:[2,145],109:[2,145],110:[2,145],113:87,114:[2,145],115:71,122:[2,145],130:[2,145],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,112],6:[2,112],28:[2,112],29:[2,112],43:[2,112],52:[2,112],57:[2,112],60:[2,112],69:[2,112],70:[2,112],71:[2,112],72:[2,112],74:[2,112],76:[2,112],77:[2,112],81:[2,112],83:[2,112],88:[2,112],89:[2,112],90:[2,112],95:[2,112],97:[2,112],106:[2,112],108:[2,112],109:[2,112],110:[2,112],114:[2,112],122:[2,112],130:[2,112],132:[2,112],133:[2,112],134:[2,112],135:[2,112],136:[2,112],137:[2,112],138:[2,112],139:[2,112],140:[2,112],141:[2,112],142:[2,112]},{1:[2,49],6:[2,49],29:[2,49],106:[2,49],107:86,108:[2,49],110:[2,49],113:87,114:[2,49],115:71,130:[2,49],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,12],6:[2,12],29:[2,12],106:[2,12],108:[2,12],110:[2,12],114:[2,12],130:[2,12]},{1:[2,13],6:[2,13],29:[2,13],106:[2,13],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[2,13],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,76],106:[1,229]},{4:230,5:3,7:4,8:5,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,134],28:[2,134],57:[2,134],60:[1,232],95:[2,134],96:231,97:[1,196],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,120],6:[2,120],28:[2,120],29:[2,120],43:[2,120],52:[2,120],57:[2,120],60:[2,120],69:[2,120],70:[2,120],71:[2,120],72:[2,120],74:[2,120],76:[2,120],77:[2,120],81:[2,120],88:[2,120],89:[2,120],90:[2,120],95:[2,120],97:[2,120],106:[2,120],108:[2,120],109:[2,120],110:[2,120],114:[2,120],120:[2,120],121:[2,120],122:[2,120],130:[2,120],132:[2,120],133:[2,120],136:[2,120],137:[2,120],138:[2,120],139:[2,120],140:[2,120],141:[2,120]},{6:[2,56],28:[2,56],56:233,57:[1,234],95:[2,56]},{6:[2,129],28:[2,129],29:[2,129],57:[2,129],90:[2,129],95:[2,129]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:235,92:[1,60],93:[1,61],94:[1,59],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,135],28:[2,135],29:[2,135],57:[2,135],90:[2,135],95:[2,135]},{1:[2,119],6:[2,119],28:[2,119],29:[2,119],43:[2,119],46:[2,119],52:[2,119],57:[2,119],60:[2,119],69:[2,119],70:[2,119],71:[2,119],72:[2,119],74:[2,119],76:[2,119],77:[2,119],81:[2,119],83:[2,119],88:[2,119],89:[2,119],90:[2,119],95:[2,119],97:[2,119],106:[2,119],108:[2,119],109:[2,119],110:[2,119],114:[2,119],120:[2,119],121:[2,119],122:[2,119],130:[2,119],132:[2,119],133:[2,119],134:[2,119],135:[2,119],136:[2,119],137:[2,119],138:[2,119],139:[2,119],140:[2,119],141:[2,119],142:[2,119]},{14:236,28:[1,116],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,148],6:[2,148],28:[2,148],29:[2,148],52:[2,148],57:[2,148],60:[2,148],76:[2,148],81:[2,148],90:[2,148],95:[2,148],97:[2,148],106:[2,148],107:86,108:[1,67],109:[1,237],110:[1,68],113:87,114:[1,70],115:71,122:[2,148],130:[2,148],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,150],6:[2,150],28:[2,150],29:[2,150],52:[2,150],57:[2,150],60:[2,150],76:[2,150],81:[2,150],90:[2,150],95:[2,150],97:[2,150],106:[2,150],107:86,108:[1,67],109:[1,238],110:[1,68],113:87,114:[1,70],115:71,122:[2,150],130:[2,150],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,156],6:[2,156],28:[2,156],29:[2,156],52:[2,156],57:[2,156],60:[2,156],76:[2,156],81:[2,156],90:[2,156],95:[2,156],97:[2,156],106:[2,156],108:[2,156],109:[2,156],110:[2,156],114:[2,156],122:[2,156],130:[2,156],132:[2,156],133:[2,156],136:[2,156],137:[2,156],138:[2,156],139:[2,156],140:[2,156],141:[2,156]},{1:[2,157],6:[2,157],28:[2,157],29:[2,157],52:[2,157],57:[2,157],60:[2,157],76:[2,157],81:[2,157],90:[2,157],95:[2,157],97:[2,157],106:[2,157],107:86,108:[1,67],109:[2,157],110:[1,68],113:87,114:[1,70],115:71,122:[2,157],130:[2,157],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,161],6:[2,161],28:[2,161],29:[2,161],52:[2,161],57:[2,161],60:[2,161],76:[2,161],81:[2,161],90:[2,161],95:[2,161],97:[2,161],106:[2,161],108:[2,161],109:[2,161],110:[2,161],114:[2,161],122:[2,161],130:[2,161],132:[2,161],133:[2,161],136:[2,161],137:[2,161],138:[2,161],139:[2,161],140:[2,161],141:[2,161]},{120:[2,163],121:[2,163]},{30:162,31:[1,75],47:163,61:164,62:165,79:[1,72],93:[1,113],94:[1,114],117:239,119:161},{57:[1,240],120:[2,169],121:[2,169]},{57:[2,165],120:[2,165],121:[2,165]},{57:[2,166],120:[2,166],121:[2,166]},{57:[2,167],120:[2,167],121:[2,167]},{57:[2,168],120:[2,168],121:[2,168]},{1:[2,162],6:[2,162],28:[2,162],29:[2,162],52:[2,162],57:[2,162],60:[2,162],76:[2,162],81:[2,162],90:[2,162],95:[2,162],97:[2,162],106:[2,162],108:[2,162],109:[2,162],110:[2,162],114:[2,162],122:[2,162],130:[2,162],132:[2,162],133:[2,162],136:[2,162],137:[2,162],138:[2,162],139:[2,162],140:[2,162],141:[2,162]},{7:241,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:242,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,56],28:[2,56],56:243,57:[1,244],81:[2,56]},{6:[2,96],28:[2,96],29:[2,96],57:[2,96],81:[2,96]},{6:[2,42],28:[2,42],29:[2,42],46:[1,245],57:[2,42],81:[2,42]},{6:[2,45],28:[2,45],29:[2,45],57:[2,45],81:[2,45]},{6:[2,46],28:[2,46],29:[2,46],46:[2,46],57:[2,46],81:[2,46]},{6:[2,47],28:[2,47],29:[2,47],46:[2,47],57:[2,47],81:[2,47]},{6:[2,48],28:[2,48],29:[2,48],46:[2,48],57:[2,48],81:[2,48]},{1:[2,4],6:[2,4],29:[2,4],106:[2,4]},{1:[2,200],6:[2,200],28:[2,200],29:[2,200],52:[2,200],57:[2,200],60:[2,200],76:[2,200],81:[2,200],90:[2,200],95:[2,200],97:[2,200],106:[2,200],107:86,108:[2,200],109:[2,200],110:[2,200],113:87,114:[2,200],115:71,122:[2,200],130:[2,200],132:[2,200],133:[2,200],136:[1,77],137:[1,80],138:[2,200],139:[2,200],140:[2,200],141:[2,200]},{1:[2,201],6:[2,201],28:[2,201],29:[2,201],52:[2,201],57:[2,201],60:[2,201],76:[2,201],81:[2,201],90:[2,201],95:[2,201],97:[2,201],106:[2,201],107:86,108:[2,201],109:[2,201],110:[2,201],113:87,114:[2,201],115:71,122:[2,201],130:[2,201],132:[2,201],133:[2,201],136:[1,77],137:[1,80],138:[2,201],139:[2,201],140:[2,201],141:[2,201]},{1:[2,202],6:[2,202],28:[2,202],29:[2,202],52:[2,202],57:[2,202],60:[2,202],76:[2,202],81:[2,202],90:[2,202],95:[2,202],97:[2,202],106:[2,202],107:86,108:[2,202],109:[2,202],110:[2,202],113:87,114:[2,202],115:71,122:[2,202],130:[2,202],132:[2,202],133:[2,202],136:[1,77],137:[2,202],138:[2,202],139:[2,202],140:[2,202],141:[2,202]},{1:[2,203],6:[2,203],28:[2,203],29:[2,203],52:[2,203],57:[2,203],60:[2,203],76:[2,203],81:[2,203],90:[2,203],95:[2,203],97:[2,203],106:[2,203],107:86,108:[2,203],109:[2,203],110:[2,203],113:87,114:[2,203],115:71,122:[2,203],130:[2,203],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[2,203],139:[2,203],140:[2,203],141:[2,203]},{1:[2,204],6:[2,204],28:[2,204],29:[2,204],52:[2,204],57:[2,204],60:[2,204],76:[2,204],81:[2,204],90:[2,204],95:[2,204],97:[2,204],106:[2,204],107:86,108:[2,204],109:[2,204],110:[2,204],113:87,114:[2,204],115:71,122:[2,204],130:[2,204],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[2,204],140:[2,204],141:[1,84]},{1:[2,205],6:[2,205],28:[2,205],29:[2,205],52:[2,205],57:[2,205],60:[2,205],76:[2,205],81:[2,205],90:[2,205],95:[2,205],97:[2,205],106:[2,205],107:86,108:[2,205],109:[2,205],110:[2,205],113:87,114:[2,205],115:71,122:[2,205],130:[2,205],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[2,205],141:[1,84]},{1:[2,206],6:[2,206],28:[2,206],29:[2,206],52:[2,206],57:[2,206],60:[2,206],76:[2,206],81:[2,206],90:[2,206],95:[2,206],97:[2,206],106:[2,206],107:86,108:[2,206],109:[2,206],110:[2,206],113:87,114:[2,206],115:71,122:[2,206],130:[2,206],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[2,206],140:[2,206],141:[2,206]},{1:[2,191],6:[2,191],28:[2,191],29:[2,191],52:[2,191],57:[2,191],60:[2,191],76:[2,191],81:[2,191],90:[2,191],95:[2,191],97:[2,191],106:[2,191],107:86,108:[1,67],109:[2,191],110:[1,68],113:87,114:[1,70],115:71,122:[2,191],130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,190],6:[2,190],28:[2,190],29:[2,190],52:[2,190],57:[2,190],60:[2,190],76:[2,190],81:[2,190],90:[2,190],95:[2,190],97:[2,190],106:[2,190],107:86,108:[1,67],109:[2,190],110:[1,68],113:87,114:[1,70],115:71,122:[2,190],130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,108],6:[2,108],28:[2,108],29:[2,108],52:[2,108],57:[2,108],60:[2,108],69:[2,108],70:[2,108],71:[2,108],72:[2,108],74:[2,108],76:[2,108],77:[2,108],81:[2,108],88:[2,108],89:[2,108],90:[2,108],95:[2,108],97:[2,108],106:[2,108],108:[2,108],109:[2,108],110:[2,108],114:[2,108],122:[2,108],130:[2,108],132:[2,108],133:[2,108],136:[2,108],137:[2,108],138:[2,108],139:[2,108],140:[2,108],141:[2,108]},{1:[2,83],6:[2,83],28:[2,83],29:[2,83],43:[2,83],52:[2,83],57:[2,83],60:[2,83],69:[2,83],70:[2,83],71:[2,83],72:[2,83],74:[2,83],76:[2,83],77:[2,83],81:[2,83],83:[2,83],88:[2,83],89:[2,83],90:[2,83],95:[2,83],97:[2,83],106:[2,83],108:[2,83],109:[2,83],110:[2,83],114:[2,83],122:[2,83],130:[2,83],132:[2,83],133:[2,83],134:[2,83],135:[2,83],136:[2,83],137:[2,83],138:[2,83],139:[2,83],140:[2,83],141:[2,83],142:[2,83]},{1:[2,84],6:[2,84],28:[2,84],29:[2,84],43:[2,84],52:[2,84],57:[2,84],60:[2,84],69:[2,84],70:[2,84],71:[2,84],72:[2,84],74:[2,84],76:[2,84],77:[2,84],81:[2,84],83:[2,84],88:[2,84],89:[2,84],90:[2,84],95:[2,84],97:[2,84],106:[2,84],108:[2,84],109:[2,84],110:[2,84],114:[2,84],122:[2,84],130:[2,84],132:[2,84],133:[2,84],134:[2,84],135:[2,84],136:[2,84],137:[2,84],138:[2,84],139:[2,84],140:[2,84],141:[2,84],142:[2,84]},{1:[2,85],6:[2,85],28:[2,85],29:[2,85],43:[2,85],52:[2,85],57:[2,85],60:[2,85],69:[2,85],70:[2,85],71:[2,85],72:[2,85],74:[2,85],76:[2,85],77:[2,85],81:[2,85],83:[2,85],88:[2,85],89:[2,85],90:[2,85],95:[2,85],97:[2,85],106:[2,85],108:[2,85],109:[2,85],110:[2,85],114:[2,85],122:[2,85],130:[2,85],132:[2,85],133:[2,85],134:[2,85],135:[2,85],136:[2,85],137:[2,85],138:[2,85],139:[2,85],140:[2,85],141:[2,85],142:[2,85]},{1:[2,86],6:[2,86],28:[2,86],29:[2,86],43:[2,86],52:[2,86],57:[2,86],60:[2,86],69:[2,86],70:[2,86],71:[2,86],72:[2,86],74:[2,86],76:[2,86],77:[2,86],81:[2,86],83:[2,86],88:[2,86],89:[2,86],90:[2,86],95:[2,86],97:[2,86],106:[2,86],108:[2,86],109:[2,86],110:[2,86],114:[2,86],122:[2,86],130:[2,86],132:[2,86],133:[2,86],134:[2,86],135:[2,86],136:[2,86],137:[2,86],138:[2,86],139:[2,86],140:[2,86],141:[2,86],142:[2,86]},{1:[2,87],6:[2,87],28:[2,87],29:[2,87],43:[2,87],52:[2,87],57:[2,87],60:[2,87],69:[2,87],70:[2,87],71:[2,87],72:[2,87],74:[2,87],76:[2,87],77:[2,87],81:[2,87],83:[2,87],88:[2,87],89:[2,87],90:[2,87],95:[2,87],97:[2,87],106:[2,87],108:[2,87],109:[2,87],110:[2,87],114:[2,87],122:[2,87],130:[2,87],132:[2,87],133:[2,87],134:[2,87],135:[2,87],136:[2,87],137:[2,87],138:[2,87],139:[2,87],140:[2,87],141:[2,87],142:[2,87]},{76:[1,246]},{60:[1,197],76:[2,92],96:247,97:[1,196],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{76:[2,93]},{7:248,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,76:[2,128],79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{11:[2,122],13:[2,122],31:[2,122],33:[2,122],34:[2,122],36:[2,122],37:[2,122],38:[2,122],39:[2,122],40:[2,122],41:[2,122],48:[2,122],49:[2,122],50:[2,122],54:[2,122],55:[2,122],76:[2,122],79:[2,122],82:[2,122],86:[2,122],87:[2,122],92:[2,122],93:[2,122],94:[2,122],100:[2,122],104:[2,122],105:[2,122],108:[2,122],110:[2,122],112:[2,122],114:[2,122],123:[2,122],129:[2,122],131:[2,122],132:[2,122],133:[2,122],134:[2,122],135:[2,122]},{11:[2,123],13:[2,123],31:[2,123],33:[2,123],34:[2,123],36:[2,123],37:[2,123],38:[2,123],39:[2,123],40:[2,123],41:[2,123],48:[2,123],49:[2,123],50:[2,123],54:[2,123],55:[2,123],76:[2,123],79:[2,123],82:[2,123],86:[2,123],87:[2,123],92:[2,123],93:[2,123],94:[2,123],100:[2,123],104:[2,123],105:[2,123],108:[2,123],110:[2,123],112:[2,123],114:[2,123],123:[2,123],129:[2,123],131:[2,123],132:[2,123],133:[2,123],134:[2,123],135:[2,123]},{1:[2,91],6:[2,91],28:[2,91],29:[2,91],43:[2,91],52:[2,91],57:[2,91],60:[2,91],69:[2,91],70:[2,91],71:[2,91],72:[2,91],74:[2,91],76:[2,91],77:[2,91],81:[2,91],83:[2,91],88:[2,91],89:[2,91],90:[2,91],95:[2,91],97:[2,91],106:[2,91],108:[2,91],109:[2,91],110:[2,91],114:[2,91],122:[2,91],130:[2,91],132:[2,91],133:[2,91],134:[2,91],135:[2,91],136:[2,91],137:[2,91],138:[2,91],139:[2,91],140:[2,91],141:[2,91],142:[2,91]},{1:[2,109],6:[2,109],28:[2,109],29:[2,109],52:[2,109],57:[2,109],60:[2,109],69:[2,109],70:[2,109],71:[2,109],72:[2,109],74:[2,109],76:[2,109],77:[2,109],81:[2,109],88:[2,109],89:[2,109],90:[2,109],95:[2,109],97:[2,109],106:[2,109],108:[2,109],109:[2,109],110:[2,109],114:[2,109],122:[2,109],130:[2,109],132:[2,109],133:[2,109],136:[2,109],137:[2,109],138:[2,109],139:[2,109],140:[2,109],141:[2,109]},{1:[2,39],6:[2,39],28:[2,39],29:[2,39],52:[2,39],57:[2,39],60:[2,39],76:[2,39],81:[2,39],90:[2,39],95:[2,39],97:[2,39],106:[2,39],107:86,108:[2,39],109:[2,39],110:[2,39],113:87,114:[2,39],115:71,122:[2,39],130:[2,39],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{7:249,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:250,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,115],6:[2,115],28:[2,115],29:[2,115],43:[2,115],52:[2,115],57:[2,115],60:[2,115],69:[2,115],70:[2,115],71:[2,115],72:[2,115],74:[2,115],76:[2,115],77:[2,115],81:[2,115],83:[2,115],88:[2,115],89:[2,115],90:[2,115],95:[2,115],97:[2,115],106:[2,115],108:[2,115],109:[2,115],110:[2,115],114:[2,115],122:[2,115],130:[2,115],132:[2,115],133:[2,115],134:[2,115],135:[2,115],136:[2,115],137:[2,115],138:[2,115],139:[2,115],140:[2,115],141:[2,115],142:[2,115]},{6:[2,56],28:[2,56],56:251,57:[1,234],90:[2,56]},{6:[2,134],28:[2,134],29:[2,134],57:[2,134],60:[1,252],90:[2,134],95:[2,134],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{53:253,54:[1,62],55:[1,63]},{6:[2,57],28:[2,57],29:[2,57],30:109,31:[1,75],47:110,58:254,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{6:[1,255],28:[1,256]},{6:[2,64],28:[2,64],29:[2,64],52:[2,64],57:[2,64]},{7:257,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,27],6:[2,27],28:[2,27],29:[2,27],52:[2,27],57:[2,27],60:[2,27],76:[2,27],81:[2,27],90:[2,27],95:[2,27],97:[2,27],102:[2,27],103:[2,27],106:[2,27],108:[2,27],109:[2,27],110:[2,27],114:[2,27],122:[2,27],125:[2,27],127:[2,27],130:[2,27],132:[2,27],133:[2,27],136:[2,27],137:[2,27],138:[2,27],139:[2,27],140:[2,27],141:[2,27]},{6:[1,76],29:[1,258]},{1:[2,207],6:[2,207],28:[2,207],29:[2,207],52:[2,207],57:[2,207],60:[2,207],76:[2,207],81:[2,207],90:[2,207],95:[2,207],97:[2,207],106:[2,207],107:86,108:[2,207],109:[2,207],110:[2,207],113:87,114:[2,207],115:71,122:[2,207],130:[2,207],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{7:259,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:260,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,210],6:[2,210],28:[2,210],29:[2,210],52:[2,210],57:[2,210],60:[2,210],76:[2,210],81:[2,210],90:[2,210],95:[2,210],97:[2,210],106:[2,210],107:86,108:[2,210],109:[2,210],110:[2,210],113:87,114:[2,210],115:71,122:[2,210],130:[2,210],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,189],6:[2,189],28:[2,189],29:[2,189],52:[2,189],57:[2,189],60:[2,189],76:[2,189],81:[2,189],90:[2,189],95:[2,189],97:[2,189],106:[2,189],108:[2,189],109:[2,189],110:[2,189],114:[2,189],122:[2,189],130:[2,189],132:[2,189],133:[2,189],136:[2,189],137:[2,189],138:[2,189],139:[2,189],140:[2,189],141:[2,189]},{7:261,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,139],6:[2,139],28:[2,139],29:[2,139],52:[2,139],57:[2,139],60:[2,139],76:[2,139],81:[2,139],90:[2,139],95:[2,139],97:[2,139],102:[1,262],106:[2,139],108:[2,139],109:[2,139],110:[2,139],114:[2,139],122:[2,139],130:[2,139],132:[2,139],133:[2,139],136:[2,139],137:[2,139],138:[2,139],139:[2,139],140:[2,139],141:[2,139]},{14:263,28:[1,116]},{14:266,28:[1,116],30:264,31:[1,75],62:265,79:[1,72]},{124:267,126:224,127:[1,225]},{29:[1,268],125:[1,269],126:270,127:[1,225]},{29:[2,182],125:[2,182],127:[2,182]},{7:272,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],99:271,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,102],6:[2,102],14:273,28:[1,116],29:[2,102],52:[2,102],57:[2,102],60:[2,102],76:[2,102],81:[2,102],90:[2,102],95:[2,102],97:[2,102],106:[2,102],107:86,108:[1,67],109:[2,102],110:[1,68],113:87,114:[1,70],115:71,122:[2,102],130:[2,102],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,105],6:[2,105],28:[2,105],29:[2,105],52:[2,105],57:[2,105],60:[2,105],76:[2,105],81:[2,105],90:[2,105],95:[2,105],97:[2,105],106:[2,105],108:[2,105],109:[2,105],110:[2,105],114:[2,105],122:[2,105],130:[2,105],132:[2,105],133:[2,105],136:[2,105],137:[2,105],138:[2,105],139:[2,105],140:[2,105],141:[2,105]},{7:274,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,146],6:[2,146],28:[2,146],29:[2,146],52:[2,146],57:[2,146],60:[2,146],69:[2,146],70:[2,146],71:[2,146],72:[2,146],74:[2,146],76:[2,146],77:[2,146],81:[2,146],88:[2,146],89:[2,146],90:[2,146],95:[2,146],97:[2,146],106:[2,146],108:[2,146],109:[2,146],110:[2,146],114:[2,146],122:[2,146],130:[2,146],132:[2,146],133:[2,146],136:[2,146],137:[2,146],138:[2,146],139:[2,146],140:[2,146],141:[2,146]},{6:[1,76],29:[1,275]},{7:276,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,70],11:[2,123],13:[2,123],28:[2,70],31:[2,123],33:[2,123],34:[2,123],36:[2,123],37:[2,123],38:[2,123],39:[2,123],40:[2,123],41:[2,123],48:[2,123],49:[2,123],50:[2,123],54:[2,123],55:[2,123],57:[2,70],79:[2,123],82:[2,123],86:[2,123],87:[2,123],92:[2,123],93:[2,123],94:[2,123],95:[2,70],100:[2,123],104:[2,123],105:[2,123],108:[2,123],110:[2,123],112:[2,123],114:[2,123],123:[2,123],129:[2,123],131:[2,123],132:[2,123],133:[2,123],134:[2,123],135:[2,123]},{6:[1,278],28:[1,279],95:[1,277]},{6:[2,57],7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[2,57],29:[2,57],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],90:[2,57],92:[1,60],93:[1,61],94:[1,59],95:[2,57],98:280,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,56],28:[2,56],29:[2,56],56:281,57:[1,234]},{1:[2,186],6:[2,186],28:[2,186],29:[2,186],52:[2,186],57:[2,186],60:[2,186],76:[2,186],81:[2,186],90:[2,186],95:[2,186],97:[2,186],106:[2,186],108:[2,186],109:[2,186],110:[2,186],114:[2,186],122:[2,186],125:[2,186],130:[2,186],132:[2,186],133:[2,186],136:[2,186],137:[2,186],138:[2,186],139:[2,186],140:[2,186],141:[2,186]},{7:282,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:283,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{120:[2,164],121:[2,164]},{30:162,31:[1,75],47:163,61:164,62:165,79:[1,72],93:[1,113],94:[1,114],119:284},{1:[2,171],6:[2,171],28:[2,171],29:[2,171],52:[2,171],57:[2,171],60:[2,171],76:[2,171],81:[2,171],90:[2,171],95:[2,171],97:[2,171],106:[2,171],107:86,108:[2,171],109:[1,285],110:[2,171],113:87,114:[2,171],115:71,122:[1,286],130:[2,171],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,172],6:[2,172],28:[2,172],29:[2,172],52:[2,172],57:[2,172],60:[2,172],76:[2,172],81:[2,172],90:[2,172],95:[2,172],97:[2,172],106:[2,172],107:86,108:[2,172],109:[1,287],110:[2,172],113:87,114:[2,172],115:71,122:[2,172],130:[2,172],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,289],28:[1,290],81:[1,288]},{6:[2,57],10:172,28:[2,57],29:[2,57],30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:291,45:171,47:175,49:[1,47],81:[2,57],93:[1,113]},{7:292,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,293],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,90],6:[2,90],28:[2,90],29:[2,90],43:[2,90],52:[2,90],57:[2,90],60:[2,90],69:[2,90],70:[2,90],71:[2,90],72:[2,90],74:[2,90],76:[2,90],77:[2,90],81:[2,90],83:[2,90],88:[2,90],89:[2,90],90:[2,90],95:[2,90],97:[2,90],106:[2,90],108:[2,90],109:[2,90],110:[2,90],114:[2,90],122:[2,90],130:[2,90],132:[2,90],133:[2,90],134:[2,90],135:[2,90],136:[2,90],137:[2,90],138:[2,90],139:[2,90],140:[2,90],141:[2,90],142:[2,90]},{7:294,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,76:[2,126],79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{76:[2,127],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,40],6:[2,40],28:[2,40],29:[2,40],52:[2,40],57:[2,40],60:[2,40],76:[2,40],81:[2,40],90:[2,40],95:[2,40],97:[2,40],106:[2,40],107:86,108:[2,40],109:[2,40],110:[2,40],113:87,114:[2,40],115:71,122:[2,40],130:[2,40],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{29:[1,295],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,278],28:[1,279],90:[1,296]},{6:[2,70],28:[2,70],29:[2,70],57:[2,70],90:[2,70],95:[2,70]},{14:297,28:[1,116]},{6:[2,60],28:[2,60],29:[2,60],52:[2,60],57:[2,60]},{30:109,31:[1,75],47:110,58:298,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{6:[2,58],28:[2,58],29:[2,58],30:109,31:[1,75],47:110,51:299,57:[2,58],58:107,59:108,61:111,62:112,79:[1,72],93:[1,113],94:[1,114]},{6:[2,65],28:[2,65],29:[2,65],52:[2,65],57:[2,65],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,28],6:[2,28],28:[2,28],29:[2,28],52:[2,28],57:[2,28],60:[2,28],76:[2,28],81:[2,28],90:[2,28],95:[2,28],97:[2,28],102:[2,28],103:[2,28],106:[2,28],108:[2,28],109:[2,28],110:[2,28],114:[2,28],122:[2,28],125:[2,28],127:[2,28],130:[2,28],132:[2,28],133:[2,28],136:[2,28],137:[2,28],138:[2,28],139:[2,28],140:[2,28],141:[2,28]},{29:[1,300],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,209],6:[2,209],28:[2,209],29:[2,209],52:[2,209],57:[2,209],60:[2,209],76:[2,209],81:[2,209],90:[2,209],95:[2,209],97:[2,209],106:[2,209],107:86,108:[2,209],109:[2,209],110:[2,209],113:87,114:[2,209],115:71,122:[2,209],130:[2,209],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{14:301,28:[1,116],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{14:302,28:[1,116]},{1:[2,140],6:[2,140],28:[2,140],29:[2,140],52:[2,140],57:[2,140],60:[2,140],76:[2,140],81:[2,140],90:[2,140],95:[2,140],97:[2,140],106:[2,140],108:[2,140],109:[2,140],110:[2,140],114:[2,140],122:[2,140],130:[2,140],132:[2,140],133:[2,140],136:[2,140],137:[2,140],138:[2,140],139:[2,140],140:[2,140],141:[2,140]},{14:303,28:[1,116]},{14:304,28:[1,116]},{1:[2,144],6:[2,144],28:[2,144],29:[2,144],52:[2,144],57:[2,144],60:[2,144],76:[2,144],81:[2,144],90:[2,144],95:[2,144],97:[2,144],102:[2,144],106:[2,144],108:[2,144],109:[2,144],110:[2,144],114:[2,144],122:[2,144],130:[2,144],132:[2,144],133:[2,144],136:[2,144],137:[2,144],138:[2,144],139:[2,144],140:[2,144],141:[2,144]},{29:[1,305],125:[1,306],126:270,127:[1,225]},{1:[2,180],6:[2,180],28:[2,180],29:[2,180],52:[2,180],57:[2,180],60:[2,180],76:[2,180],81:[2,180],90:[2,180],95:[2,180],97:[2,180],106:[2,180],108:[2,180],109:[2,180],110:[2,180],114:[2,180],122:[2,180],130:[2,180],132:[2,180],133:[2,180],136:[2,180],137:[2,180],138:[2,180],139:[2,180],140:[2,180],141:[2,180]},{14:307,28:[1,116]},{29:[2,183],125:[2,183],127:[2,183]},{14:308,28:[1,116],57:[1,309]},{28:[2,136],57:[2,136],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,103],6:[2,103],28:[2,103],29:[2,103],52:[2,103],57:[2,103],60:[2,103],76:[2,103],81:[2,103],90:[2,103],95:[2,103],97:[2,103],106:[2,103],108:[2,103],109:[2,103],110:[2,103],114:[2,103],122:[2,103],130:[2,103],132:[2,103],133:[2,103],136:[2,103],137:[2,103],138:[2,103],139:[2,103],140:[2,103],141:[2,103]},{1:[2,106],6:[2,106],14:310,28:[1,116],29:[2,106],52:[2,106],57:[2,106],60:[2,106],76:[2,106],81:[2,106],90:[2,106],95:[2,106],97:[2,106],106:[2,106],107:86,108:[1,67],109:[2,106],110:[1,68],113:87,114:[1,70],115:71,122:[2,106],130:[2,106],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{106:[1,311]},{95:[1,312],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,121],6:[2,121],28:[2,121],29:[2,121],43:[2,121],52:[2,121],57:[2,121],60:[2,121],69:[2,121],70:[2,121],71:[2,121],72:[2,121],74:[2,121],76:[2,121],77:[2,121],81:[2,121],88:[2,121],89:[2,121],90:[2,121],95:[2,121],97:[2,121],106:[2,121],108:[2,121],109:[2,121],110:[2,121],114:[2,121],120:[2,121],121:[2,121],122:[2,121],130:[2,121],132:[2,121],133:[2,121],136:[2,121],137:[2,121],138:[2,121],139:[2,121],140:[2,121],141:[2,121]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],98:313,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:205,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,28:[1,150],30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,63:151,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],91:314,92:[1,60],93:[1,61],94:[1,59],98:149,100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[2,130],28:[2,130],29:[2,130],57:[2,130],90:[2,130],95:[2,130]},{6:[1,278],28:[1,279],29:[1,315]},{1:[2,149],6:[2,149],28:[2,149],29:[2,149],52:[2,149],57:[2,149],60:[2,149],76:[2,149],81:[2,149],90:[2,149],95:[2,149],97:[2,149],106:[2,149],107:86,108:[1,67],109:[2,149],110:[1,68],113:87,114:[1,70],115:71,122:[2,149],130:[2,149],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,151],6:[2,151],28:[2,151],29:[2,151],52:[2,151],57:[2,151],60:[2,151],76:[2,151],81:[2,151],90:[2,151],95:[2,151],97:[2,151],106:[2,151],107:86,108:[1,67],109:[2,151],110:[1,68],113:87,114:[1,70],115:71,122:[2,151],130:[2,151],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{120:[2,170],121:[2,170]},{7:316,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:317,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:318,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,94],6:[2,94],28:[2,94],29:[2,94],43:[2,94],52:[2,94],57:[2,94],60:[2,94],69:[2,94],70:[2,94],71:[2,94],72:[2,94],74:[2,94],76:[2,94],77:[2,94],81:[2,94],88:[2,94],89:[2,94],90:[2,94],95:[2,94],97:[2,94],106:[2,94],108:[2,94],109:[2,94],110:[2,94],114:[2,94],120:[2,94],121:[2,94],122:[2,94],130:[2,94],132:[2,94],133:[2,94],136:[2,94],137:[2,94],138:[2,94],139:[2,94],140:[2,94],141:[2,94]},{10:172,30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:319,45:171,47:175,49:[1,47],93:[1,113]},{6:[2,95],10:172,28:[2,95],29:[2,95],30:173,31:[1,75],32:174,33:[1,73],34:[1,74],44:170,45:171,47:175,49:[1,47],57:[2,95],80:320,93:[1,113]},{6:[2,97],28:[2,97],29:[2,97],57:[2,97],81:[2,97]},{6:[2,43],28:[2,43],29:[2,43],57:[2,43],81:[2,43],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{7:321,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{76:[2,125],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,41],6:[2,41],28:[2,41],29:[2,41],52:[2,41],57:[2,41],60:[2,41],76:[2,41],81:[2,41],90:[2,41],95:[2,41],97:[2,41],106:[2,41],108:[2,41],109:[2,41],110:[2,41],114:[2,41],122:[2,41],130:[2,41],132:[2,41],133:[2,41],136:[2,41],137:[2,41],138:[2,41],139:[2,41],140:[2,41],141:[2,41]},{1:[2,116],6:[2,116],28:[2,116],29:[2,116],43:[2,116],52:[2,116],57:[2,116],60:[2,116],69:[2,116],70:[2,116],71:[2,116],72:[2,116],74:[2,116],76:[2,116],77:[2,116],81:[2,116],83:[2,116],88:[2,116],89:[2,116],90:[2,116],95:[2,116],97:[2,116],106:[2,116],108:[2,116],109:[2,116],110:[2,116],114:[2,116],122:[2,116],130:[2,116],132:[2,116],133:[2,116],134:[2,116],135:[2,116],136:[2,116],137:[2,116],138:[2,116],139:[2,116],140:[2,116],141:[2,116],142:[2,116]},{1:[2,52],6:[2,52],28:[2,52],29:[2,52],52:[2,52],57:[2,52],60:[2,52],76:[2,52],81:[2,52],90:[2,52],95:[2,52],97:[2,52],106:[2,52],108:[2,52],109:[2,52],110:[2,52],114:[2,52],122:[2,52],130:[2,52],132:[2,52],133:[2,52],136:[2,52],137:[2,52],138:[2,52],139:[2,52],140:[2,52],141:[2,52]},{6:[2,61],28:[2,61],29:[2,61],52:[2,61],57:[2,61]},{6:[2,56],28:[2,56],29:[2,56],56:322,57:[1,207]},{1:[2,208],6:[2,208],28:[2,208],29:[2,208],52:[2,208],57:[2,208],60:[2,208],76:[2,208],81:[2,208],90:[2,208],95:[2,208],97:[2,208],106:[2,208],108:[2,208],109:[2,208],110:[2,208],114:[2,208],122:[2,208],130:[2,208],132:[2,208],133:[2,208],136:[2,208],137:[2,208],138:[2,208],139:[2,208],140:[2,208],141:[2,208]},{1:[2,187],6:[2,187],28:[2,187],29:[2,187],52:[2,187],57:[2,187],60:[2,187],76:[2,187],81:[2,187],90:[2,187],95:[2,187],97:[2,187],106:[2,187],108:[2,187],109:[2,187],110:[2,187],114:[2,187],122:[2,187],125:[2,187],130:[2,187],132:[2,187],133:[2,187],136:[2,187],137:[2,187],138:[2,187],139:[2,187],140:[2,187],141:[2,187]},{1:[2,141],6:[2,141],28:[2,141],29:[2,141],52:[2,141],57:[2,141],60:[2,141],76:[2,141],81:[2,141],90:[2,141],95:[2,141],97:[2,141],106:[2,141],108:[2,141],109:[2,141],110:[2,141],114:[2,141],122:[2,141],130:[2,141],132:[2,141],133:[2,141],136:[2,141],137:[2,141],138:[2,141],139:[2,141],140:[2,141],141:[2,141]},{1:[2,142],6:[2,142],28:[2,142],29:[2,142],52:[2,142],57:[2,142],60:[2,142],76:[2,142],81:[2,142],90:[2,142],95:[2,142],97:[2,142],102:[2,142],106:[2,142],108:[2,142],109:[2,142],110:[2,142],114:[2,142],122:[2,142],130:[2,142],132:[2,142],133:[2,142],136:[2,142],137:[2,142],138:[2,142],139:[2,142],140:[2,142],141:[2,142]},{1:[2,143],6:[2,143],28:[2,143],29:[2,143],52:[2,143],57:[2,143],60:[2,143],76:[2,143],81:[2,143],90:[2,143],95:[2,143],97:[2,143],102:[2,143],106:[2,143],108:[2,143],109:[2,143],110:[2,143],114:[2,143],122:[2,143],130:[2,143],132:[2,143],133:[2,143],136:[2,143],137:[2,143],138:[2,143],139:[2,143],140:[2,143],141:[2,143]},{1:[2,178],6:[2,178],28:[2,178],29:[2,178],52:[2,178],57:[2,178],60:[2,178],76:[2,178],81:[2,178],90:[2,178],95:[2,178],97:[2,178],106:[2,178],108:[2,178],109:[2,178],110:[2,178],114:[2,178],122:[2,178],130:[2,178],132:[2,178],133:[2,178],136:[2,178],137:[2,178],138:[2,178],139:[2,178],140:[2,178],141:[2,178]},{14:323,28:[1,116]},{29:[1,324]},{6:[1,325],29:[2,184],125:[2,184],127:[2,184]},{7:326,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{1:[2,107],6:[2,107],28:[2,107],29:[2,107],52:[2,107],57:[2,107],60:[2,107],76:[2,107],81:[2,107],90:[2,107],95:[2,107],97:[2,107],106:[2,107],108:[2,107],109:[2,107],110:[2,107],114:[2,107],122:[2,107],130:[2,107],132:[2,107],133:[2,107],136:[2,107],137:[2,107],138:[2,107],139:[2,107],140:[2,107],141:[2,107]},{1:[2,147],6:[2,147],28:[2,147],29:[2,147],52:[2,147],57:[2,147],60:[2,147],69:[2,147],70:[2,147],71:[2,147],72:[2,147],74:[2,147],76:[2,147],77:[2,147],81:[2,147],88:[2,147],89:[2,147],90:[2,147],95:[2,147],97:[2,147],106:[2,147],108:[2,147],109:[2,147],110:[2,147],114:[2,147],122:[2,147],130:[2,147],132:[2,147],133:[2,147],136:[2,147],137:[2,147],138:[2,147],139:[2,147],140:[2,147],141:[2,147]},{1:[2,124],6:[2,124],28:[2,124],29:[2,124],52:[2,124],57:[2,124],60:[2,124],69:[2,124],70:[2,124],71:[2,124],72:[2,124],74:[2,124],76:[2,124],77:[2,124],81:[2,124],88:[2,124],89:[2,124],90:[2,124],95:[2,124],97:[2,124],106:[2,124],108:[2,124],109:[2,124],110:[2,124],114:[2,124],122:[2,124],130:[2,124],132:[2,124],133:[2,124],136:[2,124],137:[2,124],138:[2,124],139:[2,124],140:[2,124],141:[2,124]},{6:[2,131],28:[2,131],29:[2,131],57:[2,131],90:[2,131],95:[2,131]},{6:[2,56],28:[2,56],29:[2,56],56:327,57:[1,234]},{6:[2,132],28:[2,132],29:[2,132],57:[2,132],90:[2,132],95:[2,132]},{1:[2,173],6:[2,173],28:[2,173],29:[2,173],52:[2,173],57:[2,173],60:[2,173],76:[2,173],81:[2,173],90:[2,173],95:[2,173],97:[2,173],106:[2,173],107:86,108:[2,173],109:[2,173],110:[2,173],113:87,114:[2,173],115:71,122:[1,328],130:[2,173],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,175],6:[2,175],28:[2,175],29:[2,175],52:[2,175],57:[2,175],60:[2,175],76:[2,175],81:[2,175],90:[2,175],95:[2,175],97:[2,175],106:[2,175],107:86,108:[2,175],109:[1,329],110:[2,175],113:87,114:[2,175],115:71,122:[2,175],130:[2,175],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,174],6:[2,174],28:[2,174],29:[2,174],52:[2,174],57:[2,174],60:[2,174],76:[2,174],81:[2,174],90:[2,174],95:[2,174],97:[2,174],106:[2,174],107:86,108:[2,174],109:[2,174],110:[2,174],113:87,114:[2,174],115:71,122:[2,174],130:[2,174],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[2,98],28:[2,98],29:[2,98],57:[2,98],81:[2,98]},{6:[2,56],28:[2,56],29:[2,56],56:330,57:[1,244]},{29:[1,331],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,255],28:[1,256],29:[1,332]},{29:[1,333]},{1:[2,181],6:[2,181],28:[2,181],29:[2,181],52:[2,181],57:[2,181],60:[2,181],76:[2,181],81:[2,181],90:[2,181],95:[2,181],97:[2,181],106:[2,181],108:[2,181],109:[2,181],110:[2,181],114:[2,181],122:[2,181],130:[2,181],132:[2,181],133:[2,181],136:[2,181],137:[2,181],138:[2,181],139:[2,181],140:[2,181],141:[2,181]},{29:[2,185],125:[2,185],127:[2,185]},{28:[2,137],57:[2,137],107:86,108:[1,67],110:[1,68],113:87,114:[1,70],115:71,130:[1,85],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[1,278],28:[1,279],29:[1,334]},{7:335,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{7:336,8:118,9:19,10:20,11:[1,21],12:22,13:[1,48],15:6,16:7,17:8,18:9,19:10,20:11,21:12,22:13,23:14,24:15,25:16,26:17,27:18,30:64,31:[1,75],32:51,33:[1,73],34:[1,74],35:24,36:[1,52],37:[1,53],38:[1,54],39:[1,55],40:[1,56],41:[1,57],42:23,47:65,48:[1,46],49:[1,47],50:[1,29],53:30,54:[1,62],55:[1,63],61:49,62:50,64:36,66:25,67:26,68:27,79:[1,72],82:[1,43],86:[1,28],87:[1,45],92:[1,60],93:[1,61],94:[1,59],100:[1,38],104:[1,44],105:[1,58],107:39,108:[1,67],110:[1,68],111:40,112:[1,69],113:41,114:[1,70],115:71,123:[1,42],128:37,129:[1,66],131:[1,31],132:[1,32],133:[1,33],134:[1,34],135:[1,35]},{6:[1,289],28:[1,290],29:[1,337]},{6:[2,44],28:[2,44],29:[2,44],57:[2,44],81:[2,44]},{6:[2,62],28:[2,62],29:[2,62],52:[2,62],57:[2,62]},{1:[2,179],6:[2,179],28:[2,179],29:[2,179],52:[2,179],57:[2,179],60:[2,179],76:[2,179],81:[2,179],90:[2,179],95:[2,179],97:[2,179],106:[2,179],108:[2,179],109:[2,179],110:[2,179],114:[2,179],122:[2,179],130:[2,179],132:[2,179],133:[2,179],136:[2,179],137:[2,179],138:[2,179],139:[2,179],140:[2,179],141:[2,179]},{6:[2,133],28:[2,133],29:[2,133],57:[2,133],90:[2,133],95:[2,133]},{1:[2,176],6:[2,176],28:[2,176],29:[2,176],52:[2,176],57:[2,176],60:[2,176],76:[2,176],81:[2,176],90:[2,176],95:[2,176],97:[2,176],106:[2,176],107:86,108:[2,176],109:[2,176],110:[2,176],113:87,114:[2,176],115:71,122:[2,176],130:[2,176],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{1:[2,177],6:[2,177],28:[2,177],29:[2,177],52:[2,177],57:[2,177],60:[2,177],76:[2,177],81:[2,177],90:[2,177],95:[2,177],97:[2,177],106:[2,177],107:86,108:[2,177],109:[2,177],110:[2,177],113:87,114:[2,177],115:71,122:[2,177],130:[2,177],132:[1,79],133:[1,78],136:[1,77],137:[1,80],138:[1,81],139:[1,82],140:[1,83],141:[1,84]},{6:[2,99],28:[2,99],29:[2,99],57:[2,99],81:[2,99]}],defaultActions:{62:[2,54],63:[2,55],93:[2,114],194:[2,93]},parseError:function(e){throw new Error(e)
},parse:function(e){function t(){var e;return e=n.lexer.lex()||1,"number"!=typeof e&&(e=n.symbols_[e]||e),e}var n=this,i=[0],s=[null],r=[],o=this.table,a="",c=0,u=0,h=0;this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,"undefined"==typeof this.lexer.yylloc&&(this.lexer.yylloc={});var l=this.lexer.yylloc;r.push(l);var p=this.lexer.options&&this.lexer.options.ranges;"function"==typeof this.yy.parseError&&(this.parseError=this.yy.parseError);for(var d,f,m,w,g,b,y,v,k,_={};;){if(m=i[i.length-1],this.defaultActions[m]?w=this.defaultActions[m]:((null===d||"undefined"==typeof d)&&(d=t()),w=o[m]&&o[m][d]),"undefined"==typeof w||!w.length||!w[0]){var C="";if(!h){k=[];for(b in o[m])this.terminals_[b]&&b>2&&k.push("'"+this.terminals_[b]+"'");C=this.lexer.showPosition?"Parse error on line "+(c+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+k.join(", ")+", got '"+(this.terminals_[d]||d)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==d?"end of input":"'"+(this.terminals_[d]||d)+"'"),this.parseError(C,{text:this.lexer.match,token:this.terminals_[d]||d,line:this.lexer.yylineno,loc:l,expected:k})}}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+m+", token: "+d);switch(w[0]){case 1:i.push(d),s.push(this.lexer.yytext),r.push(this.lexer.yylloc),i.push(w[1]),d=null,f?(d=f,f=null):(u=this.lexer.yyleng,a=this.lexer.yytext,c=this.lexer.yylineno,l=this.lexer.yylloc,h>0&&h--);break;case 2:if(y=this.productions_[w[1]][1],_.$=s[s.length-y],_._$={first_line:r[r.length-(y||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(y||1)].first_column,last_column:r[r.length-1].last_column},p&&(_._$.range=[r[r.length-(y||1)].range[0],r[r.length-1].range[1]]),g=this.performAction.call(_,a,u,c,this.yy,w[1],s,r),"undefined"!=typeof g)return g;y&&(i=i.slice(0,2*-1*y),s=s.slice(0,-1*y),r=r.slice(0,-1*y)),i.push(this.productions_[w[1]][0]),s.push(_.$),r.push(_._$),v=o[i[i.length-2]][i[i.length-1]],i.push(v);break;case 3:return!0}}return!0}};return e.prototype=t,t.Parser=e,new e}();return"undefined"!=typeof require&&"undefined"!=typeof e&&(e.parser=n,e.Parser=n.Parser,e.parse=function(){return n.parse.apply(n,arguments)},e.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var n=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return e.parser.parse(n)},"undefined"!=typeof t&&require.main===t&&e.main(process.argv.slice(1))),t.exports}(),require["./iced"]=function(){var e={},t={exports:e};return function(){var t,n=[].slice;e.generator=t=function(e,t,i){var s,r,o,a,c,u;return t.transform=function(e,t){return e.icedTransform(t)},t["const"]=s={k:"__iced_k",k_noop:"__iced_k_noop",param:"__iced_p_",ns:"iced",runtime:"runtime",Deferrals:"Deferrals",deferrals:"__iced_deferrals",fulfill:"_fulfill",b_while:"_break",t_while:"_while",c_while:"_continue",n_while:"_next",n_arg:"__iced_next_arg",context:"context",defer_method:"defer",slot:"__slot",assign_fn:"assign_fn",autocb:"autocb",retslot:"ret",trace:"__iced_trace",passed_deferral:"__iced_passed_deferral",findDeferral:"findDeferral",lineno:"lineno",parent:"parent",filename:"filename",funcname:"funcname",catchExceptions:"catchExceptions",runtime_modes:["node","inline","window","none","browserify"],trampoline:"trampoline"},e.makeDeferReturn=function(t,i,r,o,a){var c,u,h,l;h={};for(c in o)l=o[c],h[c]=l;return h[s.lineno]=null!=i?i[s.lineno]:void 0,u=function(){var s,o,c;return s=1<=arguments.length?n.call(arguments,0):[],null!=i&&null!=(c=i.assign_fn)&&c.apply(null,s),t?(o=t,a||(t=null),o._fulfill(r,h)):e._warn("overused deferral at "+e._trace_to_string(h))},u[s.trace]=h,u},e.__c=0,e.tickCounter=function(t){return e.__c++,0===e.__c%t?(e.__c=0,!0):!1},e.__active_trace=null,e._trace_to_string=function(e){var t;return t=e[s.funcname]||"<anonymous>",""+t+" ("+e[s.filename]+":"+(e[s.lineno]+1)+")"},e._warn=function(e){return"undefined"!=typeof console&&null!==console?console.log("ICED warning: "+e):void 0},i.trampoline=function(t){return e.tickCounter(500)?"undefined"!=typeof process&&null!==process?process.nextTick(t):setTimeout(t):t()},i.Deferrals=r=function(){function t(e,t){this.trace=t,this.continuation=e,this.count=1,this.ret=null}return t.prototype._call=function(t){var n;return this.continuation?(e.__active_trace=t,n=this.continuation,this.continuation=null,n(this.ret)):e._warn("Entered dead await at "+e._trace_to_string(t))},t.prototype._fulfill=function(e,t){var n=this;return--this.count>0?void 0:i.trampoline(function(){return n._call(t)})},t.prototype.defer=function(t){var n;return this.count++,n=this,e.makeDeferReturn(n,t,null,this.trace)},t.prototype._defer=function(e){return this.defer(e)},t}(),i.findDeferral=c=function(e){var t,n,i;for(n=0,i=e.length;i>n;n++)if(t=e[n],null!=t?t[s.trace]:void 0)return t;return null},i.Rendezvous=o=function(){function t(){this.completed=[],this.waiters=[],this.defer_id=0}var n;return n=function(){function e(e,t,n){this.rv=e,this.id=t,this.multi=n}return e.prototype.defer=function(e){return this.rv._deferWithId(this.id,e,this.multi)},e}(),t.prototype.wait=function(e){var t;return this.completed.length?(t=this.completed.shift(),e(t)):this.waiters.push(e)},t.prototype.defer=function(e){var t;return t=this.defer_id++,this.deferWithId(t,e)},t.prototype.id=function(e,t){return null==t&&(t=!1),new n(this,e,t)},t.prototype._fulfill=function(e){var t;return this.waiters.length?(t=this.waiters.shift(),t(e)):this.completed.push(e)},t.prototype._deferWithId=function(t,n,i){return this.count++,e.makeDeferReturn(this,n,t,{},i)},t}(),i.stackWalk=u=function(t){var n,i,r,o;for(i=[],r=t?t[s.trace]:e.__active_trace;r;)n="   at "+e._trace_to_string(r),i.push(n),r=null!=r?null!=(o=r[s.parent])?o[s.trace]:void 0:void 0;return i},i.exceptionHandler=a=function(e,t){var n;return t||(t=console.log),t(e.stack),n=u(),n.length?(t("Iced callback trace:"),t(n.join("\n"))):void 0},i.catchExceptions=function(e){return"undefined"!=typeof process&&null!==process?process.on("uncaughtException",function(t){return a(t,e),process.exit(1)}):void 0}},e.runtime={},t(this,e,e.runtime)}.call(this),t.exports}(),require["./scope"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r;r=require("./helpers"),n=r.extend,s=r.last,i=require("./iced"),e.Scope=t=function(){function e(t,n,i){this.parent=t,this.expressions=n,this.method=i,this.variables=[{name:"arguments",type:"arguments"}],this.positions={},this.parent||(e.root=this)}return e.root=null,e.prototype.add=function(e,t,n){return this.shared&&!n?this.parent.add(e,t,n):Object.prototype.hasOwnProperty.call(this.positions,e)?this.variables[this.positions[e]].type=t:this.positions[e]=this.variables.push({name:e,type:t})-1},e.prototype.namedMethod=function(){var e;return(null!=(e=this.method)?e.name:void 0)||!this.parent?this.method:this.parent.namedMethod()},e.prototype.find=function(e){return this.check(e)?!0:(this.add(e,"var"),!1)},e.prototype.parameter=function(e){return this.shared&&this.parent.check(e,!0)?void 0:this.add(e,"param")},e.prototype.check=function(e){var t;return!!(this.type(e)||(null!=(t=this.parent)?t.check(e):void 0))},e.prototype.temporary=function(e,t){return e.length>1?"_"+e+(t>1?t-1:""):"_"+(t+parseInt(e,36)).toString(36).replace(/\d/g,"a")},e.prototype.type=function(e){var t,n,i,s;for(s=this.variables,n=0,i=s.length;i>n;n++)if(t=s[n],t.name===e)return t.type;return null},e.prototype.freeVariable=function(e,t){var n,i;for(null==t&&(t=!0),n=0;this.check(i=this.temporary(e,n));)n++;return t&&this.add(i,"var",!0),i},e.prototype.assign=function(e,t){return this.add(e,{value:t,assigned:!0},!0),this.hasAssignments=!0},e.prototype.hasDeclarations=function(){return!!this.declaredVariables().length},e.prototype.declaredVariables=function(){var e,t,n,s,r,o;for(e=[],t=[],o=this.variables,s=0,r=o.length;r>s;s++)n=o[s],("var"===n.type||"param"===n.type&&n.name===i["const"].k)&&("_"===n.name.charAt(0)?t:e).push(n.name);return e.sort().concat(t.sort())},e.prototype.assignedVariables=function(){var e,t,n,i,s;for(i=this.variables,s=[],t=0,n=i.length;n>t;t++)e=i[t],e.type.assigned&&s.push(""+e.name+" = "+e.type.value);return s},e}()}.call(this),t.exports}(),require["./nodes"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,F,T,L,x,N,D,E,A,S,I,R,$,O,P,j,B,V,M,H,U,W,q,G,X,Y,z,K,J,Q,Z,et,tt,nt,it,st,rt,ot,at,ct,ut,ht,lt,pt,dt,ft,mt,wt,gt,bt,yt,vt,kt,_t,Ct,Ft,Tt,Lt,xt,Nt={}.hasOwnProperty,Dt=function(e,t){function n(){this.constructor=e}for(var i in t)Nt.call(t,i)&&(e[i]=t[i]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},Et=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},At=[].slice;Error.stackTraceLimit=1/0,Y=require("./scope").Scope,Ft=require("./lexer"),U=Ft.RESERVED,X=Ft.STRICT_PROSCRIBED,ft=require("./iced"),Tt=require("./helpers"),ct=Tt.compact,pt=Tt.flatten,lt=Tt.extend,gt=Tt.merge,ut=Tt.del,vt=Tt.starts,ht=Tt.ends,mt=Tt.last,yt=Tt.some,at=Tt.addLocationDataFn,wt=Tt.locationDataToString,kt=Tt.throwSyntaxError,e.extend=lt,e.addLocationDataFn=at,ot=function(){return!0},P=function(){return!1},et=function(){return this},O=function(){return this.negated=!this.negated,this},j=function(){return new st(new R("null"))},e.CodeFragment=l=function(){function e(e,t){var n;this.code=""+t,this.locationData=null!=e?e.locationData:void 0,this.type=(null!=e?null!=(n=e.constructor)?n.name:void 0:void 0)||"unknown"}return e.prototype.toString=function(){return""+this.code+(this.locationData?": "+wt(this.locationData):"")},e}(),dt=function(e){var t;return function(){var n,i,s;for(s=[],n=0,i=e.length;i>n;n++)t=e[n],s.push(t.code);return s}().join("")},e.Base=r=function(){function e(){this.icedContinuationBlock=null,this.icedLoopFlag=!1,this.icedNodeFlag=!1,this.icedGotCpsSplitFlag=!1,this.icedCpsPivotFlag=!1,this.icedHasAutocbFlag=!1,this.icedFoundArguments=!1,this.icedParentAwait=null,this.icedCallContinuationFlag=!1}return e.prototype.compile=function(e,t){return dt(this.compileToFragments(e,t))},e.prototype.compileToFragments=function(e,t){var n;return e=lt({},e),t&&(e.level=t),n=this.unfoldSoak(e)||this,n.tab=e.indent,n.icedHasContinuation()&&!n.icedGotCpsSplitFlag?n.icedCompileCps(e):e.level!==I&&n.isStatement(e)?n.compileClosure(e):n.compileNode(e)},e.prototype.compileClosure=function(e){var t;return(t=this.jumps())&&t.error("cannot use a pure statement in an expression"),e.sharedScope=!0,this.icedClearAutocbFlags(),u.wrap(this).compileNode(e)},e.prototype.cache=function(e,t,n){var s,r;return this.isComplex()?(s=new R(n||e.scope.freeVariable("ref")),r=new i(s,this),t?[r.compileToFragments(e,t),[this.makeCode(s.value)]]:[r,s]):(s=t?this.compileToFragments(e,t):this,[s,s])},e.prototype.cacheToCodeFragments=function(e){return[dt(e[0]),dt(e[1])]},e.prototype.makeReturn=function(e){var t;return t=this.unwrapAll(),e?new a(new R(""+e+".push"),[t]):new q(t,this.icedHasAutocbFlag)},e.prototype.contains=function(e){var t;return t=void 0,this.traverseChildren(!1,function(n){return e(n)?(t=n,!1):void 0}),t},e.prototype.lastNonComment=function(e){var t;for(t=e.length;t--;)if(!(e[t]instanceof p))return e[t];return null},e.prototype.toString=function(e,t){var n,i;return null==e&&(e=""),null==t&&(t=this.constructor.name),n=[],this.icedNodeFlag&&n.push("A"),this.icedLoopFlag&&n.push("L"),this.icedCpsPivotFlag&&n.push("P"),this.icedHasAutocbFlag&&n.push("C"),this.icedParentAwait&&n.push("D"),this.icedFoundArguments&&n.push("G"),n.length&&(n=" ("+n.join("")+")"),i="\n"+e+t,i="\n"+e+t,this.soak&&(i+="?"),i+=n,this.eachChild(function(t){return i+=t.toString(e+Z)}),this.icedContinuationBlock&&(e+=Z,i+="\n"+e+"Continuation",i+=this.icedContinuationBlock.toString(e+Z)),i},e.prototype.eachChild=function(e){var t,n,i,s,r,o,a,c;if(!this.children)return this;for(a=this.children,i=0,r=a.length;r>i;i++)if(t=a[i],this[t])for(c=pt([this[t]]),s=0,o=c.length;o>s;s++)if(n=c[s],e(n)===!1)return this;return this},e.prototype.traverseChildren=function(e,t){return this.eachChild(function(n){var i;return i=t(n),i!==!1?n.traverseChildren(e,t):void 0})},e.prototype.invert=function(){return new V("!",this)},e.prototype.unwrapAll=function(){var e;for(e=this;e!==(e=e.unwrap()););return e},e.prototype.flattenChildren=function(){var e,t,n,i,s,r,o,a,c;for(n=[],a=this.children,i=0,r=a.length;r>i;i++)if(e=a[i],this[e])for(c=pt([this[e]]),s=0,o=c.length;o>s;s++)t=c[s],n.push(t);return n},e.prototype.icedCompileCps=function(e){var t;return this.icedGotCpsSplitFlag=!0,t=d.wrap(this,this.icedContinuationBlock,null,e),t.compileNode(e)},e.prototype.icedWalkAst=function(e,t){var n,i,s,r;for(this.icedParentAwait=e,this.icedHasAutocbFlag=t.foundAutocb,r=this.flattenChildren(),i=0,s=r.length;s>i;i++)n=r[i],n.icedWalkAst(e,t)&&(this.icedNodeFlag=!0);return this.icedNodeFlag},e.prototype.icedWalkAstLoops=function(e){var t,n,i,s;for(this.isLoop()&&this.icedNodeFlag&&(e=!0),this.isLoop()&&!this.icedNodeFlag&&(e=!1),this.icedLoopFlag=e,s=this.flattenChildren(),n=0,i=s.length;i>n;n++)t=s[n],t.icedWalkAstLoops(e)&&(this.icedLoopFlag=!0);return this.icedLoopFlag},e.prototype.icedWalkCpsPivots=function(){var e,t,n,i;for((this.icedNodeFlag||this.icedLoopFlag&&this.icedIsJump())&&(this.icedCpsPivotFlag=!0),i=this.flattenChildren(),t=0,n=i.length;n>t;t++)e=i[t],e.icedWalkCpsPivots()&&(this.icedCpsPivotFlag=!0);return this.icedCpsPivotFlag},e.prototype.icedClearAutocbFlags=function(){return this.icedHasAutocbFlag=!1,this.traverseChildren(!1,function(e){return e.icedHasAutocbFlag=!1,!0})},e.prototype.icedCpsRotate=function(){var e,t,n,i;for(i=this.flattenChildren(),t=0,n=i.length;n>t;t++)e=i[t],e.icedCpsRotate();return this},e.prototype.icedIsCpsPivot=function(){return this.icedCpsPivotFlag},e.prototype.icedNestContinuationBlock=function(e){return this.icedContinuationBlock=e},e.prototype.icedHasContinuation=function(){return!!this.icedContinuationBlock},e.prototype.icedCallContinuation=function(){return this.icedCallContinuationFlag=!0},e.prototype.icedWrapContinuation=P,e.prototype.icedIsJump=P,e.prototype.icedUnwrap=function(e){return e.icedHasContinuation()&&this.icedHasContinuation()?this:(this.icedHasContinuation()&&(e.icedContinuationBlock=this.icedContinuationBlock),e)},e.prototype.icedStatementAssertion=function(){return this.icedIsCpsPivot()?this.error("await'ed statements can't act as expressions"):void 0},e.prototype.children=[],e.prototype.isStatement=P,e.prototype.jumps=P,e.prototype.isComplex=ot,e.prototype.isChainable=P,e.prototype.isAssignable=P,e.prototype.isLoop=P,e.prototype.unwrap=et,e.prototype.unfoldSoak=P,e.prototype.assigns=P,e.prototype.updateLocationDataIfMissing=function(e){return this.locationData?this:(this.locationData=e,this.eachChild(function(t){return t.updateLocationDataIfMissing(e)}))},e.prototype.error=function(e){return kt(e,this.locationData)},e.prototype.makeCode=function(e){return new l(this,e)},e.prototype.wrapInBraces=function(e){return[].concat(this.makeCode("("),e,this.makeCode(")"))},e.prototype.joinFragmentArrays=function(e,t){var n,i,s,r,o;for(n=[],s=r=0,o=e.length;o>r;s=++r)i=e[s],s&&n.push(this.makeCode(t)),n=n.concat(i);return n},e}(),e.Block=o=function(e){function t(e){t.__super__.constructor.call(this),this.expressions=ct(pt(e||[]))}return Dt(t,e),t.prototype.children=["expressions"],t.prototype.push=function(e){return this.expressions.push(e),this},t.prototype.pop=function(){return this.expressions.pop()},t.prototype.unshift=function(e){return this.expressions.unshift(e),this},t.prototype.unwrap=function(){return 1===this.expressions.length?this.icedUnwrap(this.expressions[0]):this},t.prototype.isEmpty=function(){return!this.expressions.length},t.prototype.isStatement=function(e){var t,n,i,s;for(s=this.expressions,n=0,i=s.length;i>n;n++)if(t=s[n],t.isStatement(e))return!0;return!1},t.prototype.jumps=function(e){var t,n,i,s;for(s=this.expressions,n=0,i=s.length;i>n;n++)if(t=s[n],t.jumps(e))return t},t.prototype.makeReturn=function(e){var t,n,i;for(i=this.expressions.length,n=!1;i--;)if(t=this.expressions[i],!(t instanceof p)){this.expressions[i]=t.makeReturn(e),t instanceof q&&!t.expression&&!t.icedHasAutocbFlag?(this.expressions.splice(i,1),n=!0):t instanceof F&&!t.elseBody||(n=!0);break}return!this.icedHasAutocbFlag||this.icedNodeFlag||n||this.expressions.push(new q(null,!0)),this},t.prototype.compileToFragments=function(e,n){return null==e&&(e={}),e.scope?t.__super__.compileToFragments.call(this,e,n):this.compileRoot(e)},t.prototype.compileNode=function(e){var n,i,s,r,o,a,c,u,h;for(this.tab=e.indent,a=e.level===I,i=[],h=this.expressions,r=c=0,u=h.length;u>c;r=++c)o=h[r],o=o.unwrapAll(),o=o.unfoldSoak(e)||o,o instanceof t?i.push(o.compileNode(e)):a?(o.front=!0,s=o.compileToFragments(e),o.isStatement(e)||(s.unshift(this.makeCode(""+this.tab)),s.push(this.makeCode(";"))),i.push(s)):i.push(o.compileToFragments(e,E));return a?this.spaced?[].concat(this.joinFragmentArrays(i,"\n\n"),this.makeCode("\n")):this.joinFragmentArrays(i,"\n"):(n=i.length?this.joinFragmentArrays(i,", "):[this.makeCode("void 0")],i.length>1&&e.level>=E?this.wrapInBraces(n):n)},t.prototype.compileRoot=function(e){var t,n,i,s,r,o,a,c,u,h;for(e.indent=e.bare?"":Z,e.level=I,this.spaced=!0,e.scope=new Y(null,this,null),h=e.locals||[],c=0,u=h.length;u>c;c++)s=h[c],e.scope.parameter(s);return r=[],e.bare||(o=function(){var e,n,s,r;for(s=this.expressions,r=[],i=e=0,n=s.length;n>e&&(t=s[i],t.unwrap()instanceof p);i=++e)r.push(t);return r}.call(this),a=this.expressions.slice(o.length),this.expressions=o,o.length&&(r=this.compileNode(gt(e,{indent:""})),r.push(this.makeCode("\n"))),this.expressions=a),n=this.compileWithDeclarations(e),e.bare?n:[].concat(r,this.makeCode("(function() {\n"),n,this.makeCode("\n}).call(this);\n"))},t.prototype.compileWithDeclarations=function(e){var t,n,i,s,r,o,a,c,u,h,l,d,f,m;for(s=[],o=[],d=this.expressions,r=h=0,l=d.length;l>h&&(i=d[r],i=i.unwrap(),i instanceof p||i instanceof R);r=++h);return e=gt(e,{level:I}),r&&(a=this.expressions.splice(r,9e9),f=[this.spaced,!1],u=f[0],this.spaced=f[1],m=[this.compileNode(e),u],s=m[0],this.spaced=m[1],this.expressions=a),o=this.compileNode(e),c=e.scope,c.expressions===this&&(n=e.scope.hasDeclarations(),t=c.hasAssignments,n||t?(r&&s.push(this.makeCode("\n")),s.push(this.makeCode(""+this.tab+"var ")),n&&s.push(this.makeCode(c.declaredVariables().join(", "))),t&&(n&&s.push(this.makeCode(",\n"+(this.tab+Z))),s.push(this.makeCode(c.assignedVariables().join(",\n"+(this.tab+Z))))),s.push(this.makeCode(";\n"+(this.spaced?"\n":"")))):s.length&&o.length&&s.push(this.makeCode("\n"))),s.concat(o)},t.wrap=function(e){return 1===e.length&&e[0]instanceof t?e[0]:new t(e)},t.prototype.icedThreadReturn=function(e){var t,n;for(e=e||new C,n=this.expressions.length;n--&&(t=this.expressions[n],!t.isStatement());)if(!(t instanceof p||t instanceof q))return e.assignValue(t),this.expressions[n]=e,void 0;return this.expressions.push(e)},t.prototype.icedCompileCps=function(e){return this.icedGotCpsSplitFlag=!0,this.expressions.length>1?t.__super__.icedCompileCps.call(this,e):this.compileNode(e)},t.prototype.icedCpsRotate=function(){var e,n,i,s,r,o,a,c,u,h;for(s=null,h=this.expressions,i=o=0,c=h.length;c>o&&(n=h[i],n.icedIsCpsPivot()&&(s=n,s.icedCallContinuation()),n.icedCpsRotate(),!s);i=++o);if(!s)return this;if(s.icedContinuationBlock)throw SyntaxError("unexpected continuation block in node");if(r=this.expressions.slice(i+1),this.expressions=this.expressions.slice(0,i+1),r.length){for(e=new t(r),s.icedNestContinuationBlock(e),a=0,u=r.length;u>a;a++)n=r[a],n.icedNodeFlag&&(e.icedNodeFlag=!0),n.icedLoopFlag&&(e.icedLoopFlag=!0),n.icedCpsPivotFlag&&(e.icedCpsPivotFlag=!0),n.icedHasAutocbFlag&&(e.icedHasAutocbFlag=!0);e.icedCpsRotate()}return this},t.prototype.icedAddRuntime=function(e,t){var n,i;for(n=0;(i=this.expressions[n])&&i instanceof p||i instanceof st&&i.isString();)n++;return this.expressions.splice(n,0,new _(e,t))},t.prototype.icedTransform=function(e){var t;return t={},this.icedWalkAst(null,t),(null!=e?e.repl:void 0)||this.icedAddRuntime(t.foundDefer,t.foundAwait),t.foundAwait&&(this.icedWalkAstLoops(!1),this.icedWalkCpsPivots(),this.icedCpsRotate()),this},t.prototype.icedGetSingle=function(){return 1===this.expressions.length?this.expressions[0]:null},t}(r),e.Literal=R=function(e){function t(e){this.value=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.makeReturn=function(){return this.isStatement()?this:t.__super__.makeReturn.apply(this,arguments)},t.prototype.isAssignable=function(){return b.test(this.value)},t.prototype.isStatement=function(){var e;return"break"===(e=this.value)||"continue"===e||"debugger"===e},t.prototype.isComplex=P,t.prototype.assigns=function(e){return e===this.value},t.prototype.jumps=function(e){return"break"!==this.value||(null!=e?e.loop:void 0)||(null!=e?e.block:void 0)?"continue"!==this.value||(null!=e?e.loop:void 0)?void 0:this:this},t.prototype.compileNode=function(e){var t,n,i;return this.icedLoopFlag&&this.icedIsJump()?this.icedCompileIced(e):(n="this"===this.value?(null!=(i=e.scope.method)?i.bound:void 0)?e.scope.method.context:this.value:this.value.reserved?'"'+this.value+'"':this.value,t=this.isStatement()?""+this.tab+n+";":n,[this.makeCode(t)])},t.prototype.toString=function(){return' "'+this.value+'"'},t.prototype.icedWalkAst=function(e,t){return"arguments"===this.value&&t.foundAwaitFunc&&(t.foundArguments=!0,this.value="_arguments"),!1},t.prototype.icedIsJump=function(){return this.isStatement()},t.prototype.icedCompileIced=function(e){var n,i,s,r;return i={"continue":ft["const"].c_while,"break":ft["const"].b_while},r=i[this.value],s=new st(new t(r)),n=new a(s,[]),n.compileNode(e)},t}(r),e.Undefined=function(e){function t(){return Lt=t.__super__.constructor.apply(this,arguments)}return Dt(t,e),t.prototype.isAssignable=P,t.prototype.isComplex=P,t.prototype.compileNode=function(e){return[this.makeCode(e.level>=N?"(void 0)":"void 0")]},t}(r),e.Null=function(e){function t(){return xt=t.__super__.constructor.apply(this,arguments)}return Dt(t,e),t.prototype.isAssignable=P,t.prototype.isComplex=P,t.prototype.compileNode=function(){return[this.makeCode("null")]},t}(r),e.Bool=function(e){function t(e){this.val=e}return Dt(t,e),t.prototype.isAssignable=P,t.prototype.isComplex=P,t.prototype.compileNode=function(){return[this.makeCode(this.val)]},t}(r),e.Return=q=function(e){function t(e,n){t.__super__.constructor.call(this),this.icedHasAutocbFlag=n,e&&!e.unwrap().isUndefined&&(this.expression=e)}return Dt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=ot,t.prototype.makeReturn=et,t.prototype.jumps=et,t.prototype.compileToFragments=function(e,n){var i,s;return i=null!=(s=this.expression)?s.makeReturn():void 0,!i||i instanceof t?t.__super__.compileToFragments.call(this,e,n):i.compileToFragments(e,n)},t.prototype.compileNode=function(e){var t;return this.icedHasAutocbFlag?this.icedCompileIced(e):(t=[],t.push(this.makeCode(this.tab+("return"+(this.expression?" ":"")))),this.expression&&(t=t.concat(this.expression.compileToFragments(e,S))),t.push(this.makeCode(";")),t)},t.prototype.icedCompileIced=function(e){var t,n,i,s,r;return s=new st(new R(ft["const"].autocb)),t=this.expression?[this.expression]:[],i=new a(s,t),r=new R("return"),n=new o([i,r]),n.compileNode(e)},t}(r),e.Value=st=function(e){function s(e,t,n){return s.__super__.constructor.call(this),!t&&e instanceof s?e:(this.base=e,this.properties=t||[],n&&(this[n]=!0),this)}return Dt(s,e),s.prototype.children=["base","properties"],s.prototype.copy=function(){return new s(this.base,this.properties)},s.prototype.add=function(e){return this.properties=this.properties.concat(e),this},s.prototype.hasProperties=function(){return!!this.properties.length},s.prototype.isArray=function(){return!this.properties.length&&this.base instanceof n},s.prototype.isComplex=function(){return this.hasProperties()||this.base.isComplex()},s.prototype.isAssignable=function(){return this.hasProperties()||this.base.isAssignable()},s.prototype.isSimpleNumber=function(){return this.base instanceof R&&G.test(this.base.value)},s.prototype.isString=function(){return this.base instanceof R&&v.test(this.base.value)},s.prototype.isAtomic=function(){var e,t,n,i;for(i=this.properties.concat(this.base),t=0,n=i.length;n>t;t++)if(e=i[t],e.soak||e instanceof a)return!1;return!0},s.prototype.isStatement=function(e){return!this.properties.length&&this.base.isStatement(e)},s.prototype.assigns=function(e){return!this.properties.length&&this.base.assigns(e)},s.prototype.jumps=function(e){return!this.properties.length&&this.base.jumps(e)},s.prototype.isObject=function(e){return this.properties.length?!1:this.base instanceof B&&(!e||this.base.generated)},s.prototype.isSplice=function(){return mt(this.properties)instanceof z},s.prototype.unwrap=function(){return this.properties.length?this:this.base},s.prototype.cacheReference=function(e){var t,n,r,o;return r=mt(this.properties),this.properties.length<2&&!this.base.isComplex()&&!(null!=r?r.isComplex():void 0)?[this,this]:(t=new s(this.base,this.properties.slice(0,-1)),t.isComplex()&&(n=new R(e.scope.freeVariable("base")),t=new s(new H(new i(n,t)))),r?(r.isComplex()&&(o=new R(e.scope.freeVariable("name")),r=new L(new i(o,r.index)),o=new L(o)),[t.add(r),new s(n||t.base,[o||r])]):[t,n])},s.prototype.compileNode=function(e){var t,n,i,s,r;for(this.base.front=this.front,i=this.properties,t=this.base.compileToFragments(e,i.length?N:null),(this.base instanceof H||i.length)&&G.test(dt(t))&&t.push(this.makeCode(".")),s=0,r=i.length;r>s;s++)n=i[s],t.push.apply(t,n.compileToFragments(e));return t},s.prototype.unfoldSoak=function(e){var t=this;return null!=this.unfoldedSoak?this.unfoldedSoak:this.unfoldedSoak=function(){var n,r,o,a,c,u,h,l,p,d;if(o=t.base.unfoldSoak(e))return(p=o.body.properties).push.apply(p,t.properties),o;for(d=t.properties,r=h=0,l=d.length;l>h;r=++h)if(a=d[r],a.soak)return a.soak=!1,n=new s(t.base,t.properties.slice(0,r)),u=new s(t.base,t.properties.slice(r)),n.isComplex()&&(c=new R(e.scope.freeVariable("ref")),n=new H(new i(c,n)),u.base=c),new F(new m(n),u,{soak:!0});return!1}()},s.prototype.icedToSlot=function(e){var t,n;return this.base instanceof B?this.base.icedToSlot(e):(t=null,this.properties&&this.properties.length&&(n=this.properties.pop()),new K(e,this,n))},s.prototype.icedToSlotAccess=function(){return this["this"]?this.properties[0]:new t(this)},s}(r),e.Comment=p=function(e){function t(e){this.comment=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.isStatement=ot,t.prototype.makeReturn=et,t.prototype.compileNode=function(e,t){var n;return n="/*"+bt(this.comment,this.tab)+(Et.call(this.comment,"\n")>=0?"\n"+this.tab:"")+"*/",(t||e.level)===I&&(n=e.indent+n),[this.makeCode("\n"),this.makeCode(n)]},t}(r),e.Call=a=function(e){function n(e,t,i){this.args=null!=t?t:[],this.soak=i,n.__super__.constructor.call(this),this.isNew=!1,this.isSuper="super"===e,this.variable=this.isSuper?null:e}return Dt(n,e),n.prototype.children=["variable","args"],n.prototype.newInstance=function(){var e,t;return e=(null!=(t=this.variable)?t.base:void 0)||this.variable,e instanceof n&&!e.isNew?e.newInstance():this.isNew=!0,this},n.prototype.superReference=function(e){var n,i;return i=e.scope.namedMethod(),(null!=i?i.klass:void 0)?(n=[new t(new R("__super__"))],i["static"]&&n.push(new t(new R("constructor"))),n.push(new t(new R(i.name))),new st(new R(i.klass),n).compile(e)):(null!=i?i.ctor:void 0)?""+i.name+".__super__.constructor":this.error("cannot call super outside of an instance method.")},n.prototype.superThis=function(e){var t;return e.scope.icedgen?"_this":(t=e.scope.method,t&&!t.klass&&t.context||"this")},n.prototype.unfoldSoak=function(e){var t,i,s,r,o,a,c,u,h;if(this.soak){if(this.variable){if(i=_t(e,this,"variable"))return i;u=new st(this.variable).cacheReference(e),s=u[0],o=u[1]}else s=new R(this.superReference(e)),o=new st(s);return o=new n(o,this.args),o.isNew=this.isNew,s=new R("typeof "+s.compile(e)+' === "function"'),new F(s,new st(o),{soak:!0})}for(t=this,r=[];;)if(t.variable instanceof n)r.push(t),t=t.variable;else{if(!(t.variable instanceof st))break;if(r.push(t),!((t=t.variable.base)instanceof n))break}for(h=r.reverse(),a=0,c=h.length;c>a;a++)t=h[a],i&&(t.variable instanceof n?t.variable=i:t.variable.base=i),i=_t(e,t,"variable");return i},n.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,u,h;if(null!=(u=this.variable)&&(u.front=this.front),s=J.compileSplattedArray(e,this.args,!0),s.length)return this.compileSplat(e,s);for(i=[],h=this.args,n=a=0,c=h.length;c>a;n=++a)t=h[n],t.icedStatementAssertion(),n&&i.push(this.makeCode(", ")),i.push.apply(i,t.compileToFragments(e,E));return r=[],this.isSuper?(o=this.superReference(e)+(".call("+this.superThis(e)),i.length&&(o+=", "),r.push(this.makeCode(o))):(this.isNew&&r.push(this.makeCode("new ")),r.push.apply(r,this.variable.compileToFragments(e,N)),r.push(this.makeCode("("))),r.push.apply(r,i),r.push(this.makeCode(")")),r},n.prototype.compileSplat=function(e,t){var n,i,s,r,o,a;return this.isSuper?[].concat(this.makeCode(""+this.superReference(e)+".apply("+this.superThis(e)+", "),t,this.makeCode(")")):this.isNew?(r=this.tab+Z,[].concat(this.makeCode("(function(func, args, ctor) {\n"+r+"ctor.prototype = func.prototype;\n"+r+"var child = new ctor, result = func.apply(child, args);\n"+r+"return Object(result) === result ? result : child;\n"+this.tab+"})("),this.variable.compileToFragments(e,E),this.makeCode(", "),t,this.makeCode(", function(){})"))):(n=[],i=new st(this.variable),(o=i.properties.pop())&&i.isComplex()?(a=e.scope.freeVariable("ref"),n=n.concat(this.makeCode("("+a+" = "),i.compileToFragments(e,E),this.makeCode(")"),o.compileToFragments(e))):(s=i.compileToFragments(e,N),G.test(dt(s))&&(s=this.wrapInBraces(s)),o?(a=dt(s),s.push.apply(s,o.compileToFragments(e))):a="null",n=n.concat(s)),n=n.concat(this.makeCode(".apply("+a+", "),t,this.makeCode(")")))},n}(r),e.Extends=w=function(e){function t(e,n){this.child=e,this.parent=n,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["child","parent"],t.prototype.compileToFragments=function(e){return new a(new st(new R(Ct("extends"))),[this.child,this.parent]).compileToFragments(e)},t}(r),e.Access=t=function(e){function t(e,n){this.name=e,t.__super__.constructor.call(this),this.name.asKey=!0,this.soak="soak"===n}return Dt(t,e),t.prototype.children=["name"],t.prototype.compileToFragments=function(e){var t;return t=this.name.compileToFragments(e),b.test(dt(t))||this.name instanceof f?t.unshift(this.makeCode(".")):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.isComplex=P,t}(r),e.Index=L=function(e){function t(e){this.index=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["index"],t.prototype.compileToFragments=function(e){return[].concat(this.makeCode("["),this.index.compileToFragments(e,S),this.makeCode("]"))},t.prototype.isComplex=function(){return this.index.isComplex()},t}(r),e.Range=W=function(e){function t(e,n,i){this.from=e,this.to=n,t.__super__.constructor.call(this),this.exclusive="exclusive"===i,this.equals=this.exclusive?"":"="}return Dt(t,e),t.prototype.children=["from","to"],t.prototype.compileVariables=function(e){var t,n,i,s,r;return e=gt(e,{top:!0}),n=this.cacheToCodeFragments(this.from.cache(e,E)),this.fromC=n[0],this.fromVar=n[1],i=this.cacheToCodeFragments(this.to.cache(e,E)),this.toC=i[0],this.toVar=i[1],(t=ut(e,"step"))&&(s=this.cacheToCodeFragments(t.cache(e,E)),this.step=s[0],this.stepVar=s[1]),r=[this.fromVar.match(G),this.toVar.match(G)],this.fromNum=r[0],this.toNum=r[1],this.stepVar?this.stepNum=this.stepVar.match(G):void 0},t.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,u,h,l,p,d,f;return this.fromVar||this.compileVariables(e),e.index?(a=this.fromNum&&this.toNum,r=ut(e,"index"),o=ut(e,"name"),u=o&&o!==r,p=""+r+" = "+this.fromC,this.toC!==this.toVar&&(p+=", "+this.toC),this.step!==this.stepVar&&(p+=", "+this.step),d=[""+r+" <"+this.equals,""+r+" >"+this.equals],c=d[0],s=d[1],n=this.stepNum?+this.stepNum>0?""+c+" "+this.toVar:""+s+" "+this.toVar:a?(f=[+this.fromNum,+this.toNum],i=f[0],l=f[1],f,l>=i?""+c+" "+l:""+s+" "+l):(t=this.stepVar?""+this.stepVar+" > 0":""+this.fromVar+" <= "+this.toVar,""+t+" ? "+c+" "+this.toVar+" : "+s+" "+this.toVar),h=this.stepVar?""+r+" += "+this.stepVar:a?u?l>=i?"++"+r:"--"+r:l>=i?""+r+"++":""+r+"--":u?""+t+" ? ++"+r+" : --"+r:""+t+" ? "+r+"++ : "+r+"--",u&&(p=""+o+" = "+p),u&&(h=""+o+" = "+h),[this.makeCode(""+p+"; "+n+"; "+h)]):this.compileArray(e)
},t.prototype.compileArray=function(e){var t,n,i,s,r,o,a,c,u,h,l,p,d;return this.fromNum&&this.toNum&&Math.abs(this.fromNum-this.toNum)<=20?(u=function(){d=[];for(var e=p=+this.fromNum,t=+this.toNum;t>=p?t>=e:e>=t;t>=p?e++:e--)d.push(e);return d}.apply(this),this.exclusive&&u.pop(),[this.makeCode("["+u.join(", ")+"]")]):(o=this.tab+Z,r=e.scope.freeVariable("i"),h=e.scope.freeVariable("results"),c="\n"+o+h+" = [];",this.fromNum&&this.toNum?(e.index=r,n=dt(this.compileNode(e))):(l=""+r+" = "+this.fromC+(this.toC!==this.toVar?", "+this.toC:""),i=""+this.fromVar+" <= "+this.toVar,n="var "+l+"; "+i+" ? "+r+" <"+this.equals+" "+this.toVar+" : "+r+" >"+this.equals+" "+this.toVar+"; "+i+" ? "+r+"++ : "+r+"--"),a="{ "+h+".push("+r+"); }\n"+o+"return "+h+";\n"+e.indent,s=function(e){return null!=e?e.contains(function(e){return e instanceof R&&"arguments"===e.value&&!e.asKey}):void 0},(s(this.from)||s(this.to))&&(t=", arguments"),[this.makeCode("(function() {"+c+"\n"+o+"for ("+n+")"+a+"}).apply(this"+(null!=t?t:"")+")")])},t}(r),e.Slice=z=function(e){function t(e){this.range=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["range"],t.prototype.compileNode=function(e){var t,n,i,s,r,o,a;return a=this.range,r=a.to,i=a.from,s=i&&i.compileToFragments(e,S)||[this.makeCode("0")],r&&(t=r.compileToFragments(e,S),n=dt(t),(this.range.exclusive||-1!==+n)&&(o=", "+(this.range.exclusive?n:G.test(n)?""+(+n+1):(t=r.compileToFragments(e,N),"+"+dt(t)+" + 1 || 9e9")))),[this.makeCode(".slice("+dt(s)+(o||"")+")")]},t}(r),e.Obj=B=function(e){function t(e,n){this.generated=null!=n?n:!1,this.objects=this.properties=e||[],t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["properties"],t.prototype.compileNode=function(e){var t,n,s,r,o,a,c,u,h,l,d,f,m;if(h=this.properties,!h.length)return[this.makeCode(this.front?"({})":"{}")];if(this.generated)for(l=0,f=h.length;f>l;l++)c=h[l],c instanceof st&&c.error("cannot have an implicit value in an implicit object");for(s=e.indent+=Z,a=this.lastNonComment(this.properties),t=[],n=d=0,m=h.length;m>d;n=++d)u=h[n],o=n===h.length-1?"":u===a||u instanceof p?"\n":",\n",r=u instanceof p?"":s,u instanceof i&&u.variable instanceof st&&u.variable.hasProperties()&&u.variable.error("Invalid object key"),u instanceof st&&u["this"]&&(u=new i(u.properties[0].name,u,"object")),u instanceof p||(u instanceof i||(u=new i(u,u,"object")),(u.variable.base||u.variable).asKey=!0),r&&t.push(this.makeCode(r)),t.push.apply(t,u.compileToFragments(e,I)),o&&t.push(this.makeCode(o));return t.unshift(this.makeCode("{"+(h.length&&"\n"))),t.push(this.makeCode(""+(h.length&&"\n"+this.tab)+"}")),this.front?this.wrapInBraces(t):t},t.prototype.assigns=function(e){var t,n,i,s;for(s=this.properties,n=0,i=s.length;i>n;n++)if(t=s[n],t.assigns(e))return!0;return!1},t.prototype.icedToSlot=function(e){var t,n,s,r,o,a;for(o=this.properties,a=[],s=0,r=o.length;r>s;s++)n=o[s],n instanceof i?a.push(n.value.icedToSlot(e).addAccess(n.variable.icedToSlotAccess())):n instanceof st?(t=n.icedToSlotAccess(),a.push(n.icedToSlot(e).addAccess(t))):a.push(void 0);return a},t}(r),e.Arr=n=function(e){function t(e){this.objects=e||[],t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["objects"],t.prototype.compileNode=function(e){var t,n,i,s,r,o,a;if(!this.objects.length)return[this.makeCode("[]")];if(e.indent+=Z,t=J.compileSplattedArray(e,this.objects),t.length)return t;for(t=[],n=function(){var t,n,i,s;for(i=this.objects,s=[],t=0,n=i.length;n>t;t++)r=i[t],s.push(r.compileToFragments(e,E));return s}.call(this),s=o=0,a=n.length;a>o;s=++o)i=n[s],s&&t.push(this.makeCode(", ")),t.push.apply(t,i);return dt(t).indexOf("\n")>=0?(t.unshift(this.makeCode("[\n"+e.indent)),t.push(this.makeCode("\n"+this.tab+"]"))):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.assigns=function(e){var t,n,i,s;for(s=this.objects,n=0,i=s.length;i>n;n++)if(t=s[n],t.assigns(e))return!0;return!1},t}(r),e.Class=c=function(e){function n(e,t,i){this.variable=e,this.parent=t,this.body=null!=i?i:new o,n.__super__.constructor.call(this),this.boundFuncs=[],this.body.classBody=!0}return Dt(n,e),n.prototype.children=["variable","parent","body"],n.prototype.determineName=function(){var e,n;return this.variable?(e=(n=mt(this.variable.properties))?n instanceof t&&n.name.value:this.variable.base.value,Et.call(X,e)>=0&&this.variable.error("class variable name may not be "+e),e&&(e=b.test(e)&&e)):null},n.prototype.setContext=function(e){return this.body.traverseChildren(!1,function(t){return t.classBody?!1:t instanceof R&&"this"===t.value?t.value=e:t instanceof h&&(t.klass=e,t.bound)?t.context=e:void 0})},n.prototype.addBoundFunctions=function(e){var n,i,s,r,o;for(o=this.boundFuncs,s=0,r=o.length;r>s;s++)n=o[s],i=new st(new R("this"),[new t(n)]).compile(e),this.ctor.body.unshift(new R(""+i+" = "+Ct("bind")+"("+i+", this)"))},n.prototype.addProperties=function(e,n,s){var r,o,a,c,u;return u=e.base.properties.slice(0),a=function(){var e;for(e=[];r=u.shift();)r instanceof i&&(o=r.variable.base,delete r.context,c=r.value,"constructor"===o.value?(this.ctor&&r.error("cannot define more than one constructor in a class"),c.bound&&r.error("cannot define a constructor as a bound function"),c instanceof h?r=this.ctor=c:(this.externalCtor=s.scope.freeVariable("class"),r=new i(new R(this.externalCtor),c))):r.variable["this"]?(c["static"]=!0,c.bound&&(c.context=n)):(r.variable=new st(new R(n),[new t(new R("prototype")),new t(o)]),c instanceof h&&c.bound&&(this.boundFuncs.push(o),c.bound=!1))),e.push(r);return e}.call(this),ct(a)},n.prototype.walkBody=function(e,t){var i=this;return this.traverseChildren(!1,function(s){var r,a,c,u,h,l,p;if(r=!0,s instanceof n)return!1;if(s instanceof o){for(p=a=s.expressions,c=h=0,l=p.length;l>h;c=++h)u=p[c],u instanceof st&&u.isObject(!0)&&(r=!1,a[c]=i.addProperties(u,e,t));s.expressions=a=pt(a)}return r&&!(s instanceof n)})},n.prototype.hoistDirectivePrologue=function(){var e,t,n;for(t=0,e=this.body.expressions;(n=e[t])&&n instanceof p||n instanceof st&&n.isString();)++t;return this.directives=e.splice(0,t)},n.prototype.ensureConstructor=function(e,t){var n,s,r;return n=!this.ctor,this.ctor||(this.ctor=new h),this.ctor.ctor=this.ctor.name=e,this.ctor.klass=null,this.ctor.noReturn=!0,n?(this.parent&&(r=new R(""+e+".__super__.constructor.apply(this, arguments)")),this.externalCtor&&(r=new R(""+this.externalCtor+".apply(this, arguments)")),r&&(s=new R(t.scope.freeVariable("ref")),this.ctor.body.unshift(new i(s,r))),this.addBoundFunctions(t),r&&(this.ctor.body.push(s),this.ctor.body.makeReturn()),this.body.expressions.unshift(this.ctor)):this.addBoundFunctions(t)},n.prototype.compileNode=function(e){var t,n,s,r,o,a,c;return n=this.determineName(),o=n||"_Class",o.reserved&&(o="_"+o),r=new R(o),this.hoistDirectivePrologue(),this.setContext(o),this.walkBody(o,e),this.ensureConstructor(o,e),this.body.spaced=!0,this.ctor instanceof h||this.body.expressions.unshift(this.ctor),this.body.expressions.push(r),(c=this.body.expressions).unshift.apply(c,this.directives),t=u.wrap(this.body),this.parent&&(this.superClass=new R(e.scope.freeVariable("super",!1)),this.body.expressions.unshift(new w(r,this.superClass)),t.args.push(this.parent),a=t.variable.params||t.variable.base.params,a.push(new M(this.superClass))),s=new H(t,!0),this.variable&&(s=new i(this.variable,s)),s.compileToFragments(e)},n}(r),e.Assign=i=function(e){function n(e,t,i,s){var r,o,a;this.variable=e,this.value=t,this.context=i,n.__super__.constructor.call(this),this.param=s&&s.param,this.subpattern=s&&s.subpattern,a=o=this.variable.unwrapAll().value,r=Et.call(X,a)>=0,r&&"object"!==this.context&&this.variable.error('variable name may not be "'+o+'"'),this.icedlocal=s&&s.icedlocal}return Dt(n,e),n.prototype.children=["variable","value"],n.prototype.isStatement=function(e){return(null!=e?e.level:void 0)===I&&null!=this.context&&Et.call(this.context,"?")>=0},n.prototype.assigns=function(e){return this["object"===this.context?"value":"variable"].assigns(e)},n.prototype.unfoldSoak=function(e){return _t(e,this,"variable")},n.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,u,l,p;if(this.value.icedStatementAssertion(),i=this.variable instanceof st){if(this.variable.isArray()||this.variable.isObject())return this.compilePatternMatch(e);if(this.variable.isSplice())return this.compileSplice(e);if("||="===(c=this.context)||"&&="===c||"?="===c)return this.compileConditional(e)}return n=this.variable.compileToFragments(e,E),r=dt(n),this.context||(a=this.variable.unwrapAll(),a.isAssignable()||this.variable.error('"'+this.variable.compile(e)+'" cannot be assigned'),("function"==typeof a.hasProperties?a.hasProperties():void 0)||(this.param||this.icedlocal?e.scope.add(r,"var",this.icedlocal):e.scope.find(r))),this.value instanceof h&&(s=$.exec(r))&&(s[1]&&(this.value.klass=s[1]),this.value.name=null!=(u=null!=(l=null!=(p=s[2])?p:s[3])?l:s[4])?u:s[5]),o=this.value.compileToFragments(e,E),"object"===this.context?n.concat(this.makeCode(": "),o):(t=n.concat(this.makeCode(" "+(this.context||"=")+" "),o),e.level<=E?t:this.wrapInBraces(t))},n.prototype.compilePatternMatch=function(e){var i,s,r,o,a,c,u,h,l,p,d,f,m,w,g,y,v,k,_,C,F,T,x,N,D,S,$,O;if(y=e.level===I,k=this.value,d=this.variable.base.objects,!(f=d.length))return r=k.compileToFragments(e),e.level>=A?this.wrapInBraces(r):r;if(u=this.variable.isObject(),y&&1===f&&!((p=d[0])instanceof J))return p instanceof n?(x=p,N=x.variable,c=N.base,p=x.value):c=u?p["this"]?p.properties[0].name:p:new R(0),i=b.test(c.unwrap().value||0),k=new st(k),k.properties.push(new(i?t:L)(c)),D=p.unwrap().value,Et.call(U,D)>=0&&p.error("assignment to a reserved word: "+p.compile(e)),new n(p,k,null,{param:this.param}).compileToFragments(e,I);for(_=k.compileToFragments(e,E),C=dt(_),s=[],g=!1,(!b.test(C)||this.variable.assigns(C))&&(s.push([this.makeCode(""+(m=e.scope.freeVariable("ref"))+" = ")].concat(At.call(_))),_=[this.makeCode(m)],C=m),a=F=0,T=d.length;T>F;a=++F)p=d[a],c=a,u&&(p instanceof n?(S=p,$=S.variable,c=$.base,p=S.value):p.base instanceof H?(O=new st(p.unwrapAll()).cacheReference(e),p=O[0],c=O[1]):c=p["this"]?p.properties[0].name:p),!g&&p instanceof J?(l=p.name.unwrap().value,p=p.unwrap(),v=""+f+" <= "+C+".length ? "+Ct("slice")+".call("+C+", "+a,(w=f-a-1)?(h=e.scope.freeVariable("i"),v+=", "+h+" = "+C+".length - "+w+") : ("+h+" = "+a+", [])"):v+=") : []",v=new R(v),g=""+h+"++"):(l=p.unwrap().value,p instanceof J&&p.error("multiple splats are disallowed in an assignment"),"number"==typeof c?(c=new R(g||c),i=!1):i=u&&b.test(c.unwrap().value||0),v=new st(new R(C),[new(i?t:L)(c)])),null!=l&&Et.call(U,l)>=0&&p.error("assignment to a reserved word: "+p.compile(e)),s.push(new n(p,v,null,{param:this.param,subpattern:!0}).compileToFragments(e,E));return y||this.subpattern||s.push(_),o=this.joinFragmentArrays(s,", "),e.level<E?o:this.wrapInBraces(o)},n.prototype.compileConditional=function(e){var t,i,s;return s=this.variable.cacheReference(e),t=s[0],i=s[1],!t.properties.length&&t.base instanceof R&&"this"!==t.base.value&&!e.scope.check(t.base.value)&&this.variable.error('the variable "'+t.base.value+"\" can't be assigned with "+this.context+" because it has not been declared before"),Et.call(this.context,"?")>=0&&(e.isExistentialEquals=!0),new V(this.context.slice(0,-1),t,new n(i,this.value,"=")).compileToFragments(e)},n.prototype.compileSplice=function(e){var t,n,i,s,r,o,a,c,u,h,l,p;return h=this.variable.properties.pop().range,i=h.from,a=h.to,n=h.exclusive,o=this.variable.compile(e),i?(l=this.cacheToCodeFragments(i.cache(e,A)),s=l[0],r=l[1]):s=r="0",a?(null!=i?i.isSimpleNumber():void 0)&&a.isSimpleNumber()?(a=+a.compile(e)-+r,n||(a+=1)):(a=a.compile(e,N)+" - "+r,n||(a+=" + 1")):a="9e9",p=this.value.cache(e,E),c=p[0],u=p[1],t=[].concat(this.makeCode("[].splice.apply("+o+", ["+s+", "+a+"].concat("),c,this.makeCode(")), "),u),e.level>I?this.wrapInBraces(t):t},n}(r),e.Code=h=function(e){function s(e,t,n){s.__super__.constructor.call(this),this.params=e||[],this.body=t||new o,this.icedgen="icedgen"===n,this.bound="boundfunc"===n||this.icedgen,(this.bound||this.icedgen)&&(this.context="_this"),this.icedPassedDeferral=null}return Dt(s,e),s.prototype.children=["params","body"],s.prototype.isStatement=function(){return!!this.ctor},s.prototype.jumps=P,s.prototype.compileNode=function(e){var t,s,r,o,a,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,T,L,x,D,E,A,S,I;for(e.scope=new Y(e.scope,this.body,this),e.scope.shared=ut(e,"sharedScope")||this.icedgen,e.scope.icedgen=this.icedgen,e.indent+=Z,delete e.bare,delete e.isExistentialEquals,l=[],r=[],this.eachParamName(function(t){return e.scope.check(t)?void 0:e.scope.parameter(t)}),D=this.params,g=0,k=D.length;k>g;g++)if(h=D[g],h.splat){for(E=this.params,b=0,_=E.length;_>b;b++)u=E[b].name,u["this"]&&(u=u.properties[0].name),u.value&&e.scope.add(u.value,"var",!0);d=new i(new st(new n(function(){var t,n,i,s;for(i=this.params,s=[],t=0,n=i.length;n>t;t++)u=i[t],s.push(u.asReference(e));return s}.call(this))),new st(new R("arguments")));break}for(A=this.params,y=0,C=A.length;C>y;y++)h=A[y],h.isComplex()?(m=p=h.asReference(e),h.value&&(m=new V("?",p,h.value)),r.push(new i(new st(h.name),m,"=",{param:!0}))):(p=h,h.value&&(c=new R(p.name.value+" == null"),m=new i(new st(h.name),h.value,"="),r.push(new F(c,m)))),d||l.push(p);for(w=this.body.isEmpty(),d&&r.unshift(d),r.length&&(S=this.body.expressions).unshift.apply(S,r),o=v=0,T=l.length;T>v;o=++v)u=l[o],l[o]=u.compileToFragments(e),e.scope.parameter(dt(l[o]));for(f=[],this.eachParamName(function(e,t){return Et.call(f,e)>=0&&t.error("multiple parameters named '"+e+"'"),f.push(e)}),this.icedHasAutocbFlag&&(w=!1),w||this.noReturn||this.body.makeReturn(),this.bound&&((null!=(I=e.scope.parent.method)?I.bound:void 0)?this.bound=this.context=e.scope.parent.method.context:this["static"]||e.scope.parent.assign("_this","this")),a=e.indent,s="function",this.ctor&&(s+=" "+this.name),s+="(",t=[this.makeCode(s)],o=x=0,L=l.length;L>x;o=++x)u=l[o],o&&t.push(this.makeCode(", ")),t.push.apply(t,u);return t.push(this.makeCode(") {")),this.icedPatchBody(e),this.body.isEmpty()||(t=t.concat(this.makeCode("\n"),this.body.compileWithDeclarations(e),this.makeCode("\n"+this.tab))),t.push(this.makeCode("}")),this.ctor?[this.makeCode(this.tab)].concat(At.call(t)):this.front||e.level>=N?this.wrapInBraces(t):t},s.prototype.eachParamName=function(e){var t,n,i,s,r;for(s=this.params,r=[],n=0,i=s.length;i>n;n++)t=s[n],r.push(t.eachName(e));return r},s.prototype.traverseChildren=function(e,t){return e?s.__super__.traverseChildren.call(this,e,t):void 0},s.prototype.icedPatchBody=function(e){var n,s,r,o;return this.icedFoundArguments&&this.icedNodeFlag&&e.scope.assign("_arguments","arguments"),this.icedNodeFlag&&!this.icedgen&&(this.icedPassedDeferral=e.scope.freeVariable(ft["const"].passed_deferral),s=new st(new R(this.icedPassedDeferral)),n=new st(new R(ft["const"].ns)),n.add(new t(new st(new R(ft["const"].findDeferral)))),o=new a(n,[new st(new R("arguments"))]),this.body.unshift(new i(s,o))),this.icedNodeFlag&&!this.icedgen?(r=this.icedHasAutocbFlag?ft["const"].autocb:ft["const"].k_noop,o=new st(new R(r)),s=new st(new R(ft["const"].k)),this.body.unshift(new i(s,o,null,{icedlocal:!0}))):void 0},s.prototype.icedWalkAst=function(e,t){var n,i,r,o,a,c,u,h;for(this.icedParentAwait=e,i=t.foundAutocb,n=t.currFunc,o=t.foundArguments,r=t.foundAwaitFunc,t.foundAutocb=!1,t.foundArguments=!1,t.foundAwaitFunc=!1,t.currFunc=this,h=this.params,c=0,u=h.length;u>c;c++)if(a=h[c],a.name instanceof R&&a.name.value===ft["const"].autocb){t.foundAutocb=!0;break}return this.icedHasAutocbFlag=t.foundAutocb,s.__super__.icedWalkAst.call(this,e,t),this.icedFoundArguments=t.foundArguments,t.foundAwaitFunc=r,t.foundArguments=o,t.foundAutocb=i,t.currFunc=n,!1},s.prototype.icedWalkAstLoops=function(){return s.__super__.icedWalkAstLoops.call(this,!1)&&(this.icedLoopFlag=!0),!1},s.prototype.icedWalkCpsPivots=function(){return s.__super__.icedWalkCpsPivots.call(this),this.icedCpsPivotFlag=!1},s.prototype.icedTraceName=function(){var e;return e=[],this.klass&&e.push(this.klass),this.name&&e.push(this.name),e.join(".")},s}(r),e.Param=M=function(e){function t(e,n,i){var s;this.name=e,this.value=n,this.splat=i,t.__super__.constructor.call(this),s=e=this.name.unwrapAll().value,Et.call(X,s)>=0&&this.name.error('parameter name "'+e+'" is not allowed')}return Dt(t,e),t.prototype.children=["name","value"],t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e,E)},t.prototype.asReference=function(e){var t;return this.reference?this.reference:(t=this.name,t["this"]?(t=t.properties[0].name,t.value.reserved&&(t=new R(e.scope.freeVariable(t.value)))):t.isComplex()&&(t=new R(e.scope.freeVariable("arg"))),t=new st(t),this.splat&&(t=new J(t)),this.reference=t)},t.prototype.isComplex=function(){return this.name.isComplex()},t.prototype.eachName=function(e,t){var n,s,r,o,a,c;if(null==t&&(t=this.name),n=function(t){var n;return n=t.properties[0].name,n.value.reserved?void 0:e(n.value,n)},t instanceof R)return e(t.value,t);if(t instanceof st)return n(t);for(c=t.objects,o=0,a=c.length;a>o;o++)r=c[o],r instanceof i?this.eachName(e,r.value.unwrap()):r instanceof J?(s=r.name.unwrap(),e(s.value,s)):r instanceof st?r.isArray()||r.isObject()?this.eachName(e,r.base):r["this"]?n(r):e(r.base.value,r.base):r.error("illegal parameter "+r.compile())},t}(r),e.Splat=J=function(e){function t(e){t.__super__.constructor.call(this),this.name=e.compile?e:new R(e)}return Dt(t,e),t.prototype.children=["name"],t.prototype.isAssignable=ot,t.prototype.assigns=function(e){return this.name.assigns(e)},t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e)},t.prototype.unwrap=function(){return this.name},t.compileSplattedArray=function(e,n,i){var s,r,o,a,c,u,h,l,p,d;for(h=-1;(l=n[++h])&&!(l instanceof t););if(h>=n.length)return[];if(1===n.length)return l=n[0],c=l.compileToFragments(e,E),i?c:[].concat(l.makeCode(""+Ct("slice")+".call("),c,l.makeCode(")"));for(s=n.slice(h),u=p=0,d=s.length;d>p;u=++p)l=s[u],o=l.compileToFragments(e,E),s[u]=l instanceof t?[].concat(l.makeCode(""+Ct("slice")+".call("),o,l.makeCode(")")):[].concat(l.makeCode("["),o,l.makeCode("]"));return 0===h?(l=n[0],a=l.joinFragmentArrays(s.slice(1),", "),s[0].concat(l.makeCode(".concat("),a,l.makeCode(")"))):(r=function(){var t,i,s,r;for(s=n.slice(0,h),r=[],t=0,i=s.length;i>t;t++)l=s[t],r.push(l.compileToFragments(e,E));return r}(),r=n[0].joinFragmentArrays(r,", "),a=n[h].joinFragmentArrays(s,", "),[].concat(n[0].makeCode("["),r,n[h].makeCode("].concat("),a,mt(n).makeCode(")")))},t.prototype.icedToSlot=function(e){return new K(e,new st(this.name),null,!0)},t}(r),e.While=rt=function(e){function s(e,t){this.condition=(null!=t?t.invert:void 0)?e.invert():e,this.guard=null!=t?t.guard:void 0}return Dt(s,e),s.prototype.children=["condition","guard","body"],s.prototype.isStatement=ot,s.prototype.isLoop=ot,s.prototype.makeReturn=function(e){return e?s.__super__.makeReturn.apply(this,arguments):(this.returns=!this.jumps({loop:!0}),this)},s.prototype.addBody=function(e){return this.body=e,this},s.prototype.jumps=function(){var e,t,n,i;if(e=this.body.expressions,!e.length)return!1;for(n=0,i=e.length;i>n;n++)if(t=e[n],t.jumps({loop:!0}))return t;return!1},s.prototype.compileNode=function(e){var t,n,i,s;return this.condition.icedStatementAssertion(),this.icedNodeFlag?this.icedCompileIced(e):(e.indent+=Z,s="",n=this.body,n.isEmpty()?n=this.makeCode(""):(this.returns&&(n.makeReturn(i=e.scope.freeVariable("results")),s=""+this.tab+i+" = [];\n"),this.guard&&(n.expressions.length>1?n.expressions.unshift(new F(new H(this.guard).invert(),new R("continue"))):this.guard&&(n=o.wrap([new F(this.guard,n)]))),n=[].concat(this.makeCode("\n"),n.compileToFragments(e,I),this.makeCode("\n"+this.tab))),t=[].concat(this.makeCode(s+this.tab+"while ("),this.condition.compileToFragments(e,S),this.makeCode(") {"),n,this.makeCode("}")),this.returns&&(this.icedHasAutocbFlag?(t.push(this.makeCode("\n"+this.tab+ft["const"].autocb+"("+i+");")),t.push(this.makeCode("\n"+this.tab+"return;"))):t.push(this.makeCode("\n"+this.tab+"return "+i+";"))),t)},s.prototype.icedWrap=function(e){var s,r,c,u,l,p,d,f,m,w,g,b,y,v,k,_,C,T,L,x,N,D,E,A,S,I,$,O,P,j,B,V,H,U,W,q,G;return w=e.condition,s=e.body,$=e.rvar,I=[],$&&(P=new st(new R($))),W=new st(new R(ft["const"].t_while)),L=new st(new R(ft["const"].k)),x=new M(new R(ft["const"].k)),p=new st(new R(ft["const"].b_while)),$?(l=new a(L,[P]),c=new o([l]),u=new h([],c,"icedgen"),r=new i(p,u,null,{icedlocal:!0})):r=new i(p,L,null,{icedlocal:!0}),_=new st(new R(ft["const"].c_while)),y=new o([new a(W,[L])]),e.step&&y.unshift(e.step),k=new h([],y),G=new st(new R(ft["const"].ns)),G.add(new t(new st(new R(ft["const"].trampoline)))),b=new o([new a(G,[k])]),v=new h([],b,"icedgen"),g=new i(_,v,null,{icedlocal:!0}),S=new st(new R(ft["const"].n_while)),$?(N=new M(new R(ft["const"].n_arg)),C=P.copy(),C.add(new t(new st(new R("push")))),d=new a(C,[N]),f=new a(_,[]),E=new o([d,f]),A=new h([N],E,"icedgen"),D=new i(S,A,null,{icedlocal:!0})):D=new i(S,_),m=new F(w.invert(),new o([new a(p,[])])),e.guard?(b=new o([new a(_,[])]),T=new F(e.guard,s),T.addElse(b),m.addElse(new o([e.pre_body,T]))):m.addElse(new o([e.pre_body,s])),V=new o([r,g,D,m]),U=new h([x],V,"icedgen"),j=new i(W,U,null,{icedlocal:!0}),H=new a(W,[L]),q=[],e.init&&(q=q.concat(e.init)),$&&(O=new i(P,new n),q.push(O)),q=q.concat([j,H]),B=new o(q)},s.prototype.icedCallContinuation=function(){return this.body.icedThreadReturn(new C(ft["const"].n_while))},s.prototype.icedCompileIced=function(e){var t,n;return n={condition:this.condition,body:this.body,guard:this.guard},this.returns&&(n.rvar=e.scope.freeVariable("results")),t=this.icedWrap(n),t.compileNode(e)},s}(r),e.Op=V=function(e){function t(e,i,s,r){if(t.__super__.constructor.call(this),"in"===e)return new T(i,s);if("do"===e)return this.generateDo(i);if("new"===e){if(i instanceof a&&!i["do"]&&!i.isNew)return i.newInstance();(i instanceof h&&i.bound||i["do"])&&(i=new H(i))}return this.operator=n[e]||e,this.first=i,this.second=s,this.flip=!!r,this}var n,s;return Dt(t,e),n={"==":"===","!=":"!==",of:"in"},s={"!==":"===","===":"!=="},t.prototype.children=["first","second"],t.prototype.isSimpleNumber=P,t.prototype.isUnary=function(){return!this.second},t.prototype.isComplex=function(){var e;return!(this.isUnary()&&("+"===(e=this.operator)||"-"===e))||this.first.isComplex()},t.prototype.isChainable=function(){var e;return"<"===(e=this.operator)||">"===e||">="===e||"<="===e||"==="===e||"!=="===e},t.prototype.invert=function(){var e,n,i,r,o;if(this.isChainable()&&this.first.isChainable()){for(e=!0,n=this;n&&n.operator;)e&&(e=n.operator in s),n=n.first;if(!e)return new H(this).invert();for(n=this;n&&n.operator;)n.invert=!n.invert,n.operator=s[n.operator],n=n.first;return this}return(r=s[this.operator])?(this.operator=r,this.first.unwrap()instanceof t&&this.first.invert(),this):this.second?new H(this).invert():"!"===this.operator&&(i=this.first.unwrap())instanceof t&&("!"===(o=i.operator)||"in"===o||"instanceof"===o)?i:new t("!",this)},t.prototype.unfoldSoak=function(e){var t;return("++"===(t=this.operator)||"--"===t||"delete"===t)&&_t(e,this,"first")},t.prototype.generateDo=function(e){var t,n,s,r,o,c,u,l;for(r=[],n=e instanceof i&&(o=e.value.unwrap())instanceof h?o:e,l=n.params||[],c=0,u=l.length;u>c;c++)s=l[c],s.value?(r.push(s.value),delete s.value):r.push(s);return t=new a(e,r),t["do"]=!0,t},t.prototype.compileNode=function(e){var t,n,i,s;return n=this.isChainable()&&this.first.isChainable(),n||(this.first.front=this.front),"delete"===this.operator&&e.scope.check(this.first.unwrapAll().value)&&this.error("delete operand may not be argument or var"),("--"===(i=this.operator)||"++"===i)&&(s=this.first.unwrapAll().value,Et.call(X,s)>=0)&&this.error('cannot increment/decrement "'+this.first.unwrapAll().value+'"'),this.isUnary()?this.compileUnary(e):n?this.compileChain(e):"?"===this.operator?this.compileExistence(e):(t=[].concat(this.first.compileToFragments(e,A),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,A)),e.level<=A?t:this.wrapInBraces(t))},t.prototype.compileChain=function(e){var t,n,i,s;return s=this.first.second.cache(e),this.first.second=s[0],i=s[1],n=this.first.compileToFragments(e,A),t=n.concat(this.makeCode(" "+(this.invert?"&&":"||")+" "),i.compileToFragments(e),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,A)),this.wrapInBraces(t)},t.prototype.compileExistence=function(e){var t,n;return!e.isExistentialEquals&&this.first.isComplex()?(n=new R(e.scope.freeVariable("ref")),t=new H(new i(n,this.first))):(t=this.first,n=t),new F(new m(t),n,{type:"if"}).addElse(this.second).compileToFragments(e)},t.prototype.compileUnary=function(e){var n,i,s;return i=[],n=this.operator,i.push([this.makeCode(n)]),"!"===n&&this.first instanceof m?(this.first.negated=!this.first.negated,this.first.compileToFragments(e)):e.level>=N?new H(this).compileToFragments(e):(s="+"===n||"-"===n,("new"===n||"typeof"===n||"delete"===n||s&&this.first instanceof t&&this.first.operator===n)&&i.push([this.makeCode(" ")]),(s&&this.first instanceof t||"new"===n&&this.first.isStatement(e))&&(this.first=new H(this.first)),i.push(this.first.compileToFragments(e,A)),this.flip&&i.reverse(),this.joinFragmentArrays(i,""))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+" "+this.operator)},t.prototype.icedWrapContinuation=function(){return this.icedCallContinuationFlag},t}(r),e.In=T=function(e){function t(e,n){this.object=e,this.array=n,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["object","array"],t.prototype.invert=O,t.prototype.compileNode=function(e){var t,n,i,s,r;if(this.array instanceof st&&this.array.isArray()){for(r=this.array.base.objects,i=0,s=r.length;s>i;i++)if(n=r[i],n instanceof J){t=!0;break}if(!t)return this.compileOrTest(e)}return this.compileLoopTest(e)},t.prototype.compileOrTest=function(e){var t,n,i,s,r,o,a,c,u,h,l,p;if(0===this.array.base.objects.length)return[this.makeCode(""+!!this.negated)];for(h=this.object.cache(e,A),o=h[0],r=h[1],l=this.negated?[" !== "," && "]:[" === "," || "],t=l[0],n=l[1],a=[],p=this.array.base.objects,i=c=0,u=p.length;u>c;i=++c)s=p[i],i&&a.push(this.makeCode(n)),a=a.concat(i?r:o,this.makeCode(t),s.compileToFragments(e,N));return e.level<A?a:this.wrapInBraces(a)},t.prototype.compileLoopTest=function(e){var t,n,i,s;return s=this.object.cache(e,E),i=s[0],n=s[1],t=[].concat(this.makeCode(Ct("indexOf")+".call("),this.array.compileToFragments(e,E),this.makeCode(", "),n,this.makeCode(") "+(this.negated?"< 0":">= 0"))),dt(i)===dt(n)?t:(t=i.concat(this.makeCode(", "),t),e.level<E?t:this.wrapInBraces(t))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+(this.negated?"!":""))},t}(r),e.Slot=K=function(e){function t(e,n,i,s){t.__super__.constructor.call(this),this.index=e,this.value=n,this.suffix=i,this.splat=s,this.access=null}return Dt(t,e),t.prototype.addAccess=function(e){return this.access=e,this},t.prototype.children=["value","suffix"],t}(r),e.Defer=f=function(e){function n(e,t){var i,s;this.lineno=t,n.__super__.constructor.call(this),this.slots=pt(function(){var t,n,r;for(r=[],s=t=0,n=e.length;n>t;s=++t)i=e[s],r.push(i.icedToSlot(s));return r}()),this.params=[],this.vars=[],this.custom=!1}return Dt(n,e),n.prototype.children=["slots"],n.prototype.setCustom=function(){return this.custom=!0,this},n.prototype.newParam=function(){var e;return e=""+ft["const"].slot+"_"+(this.params.length+1),this.params.push(new M(new R(e))),new st(new R(e))},n.prototype.makeAssignFn=function(e){var n,s,r,c,u,l,p,d,f,m,w,g,b,y,v,k,_,C,F;if(0===this.slots.length)return null;for(c=[],s=[],d=0,F=this.slots,_=0,C=F.length;C>_;_++)v=F[_],d=v.index,n=new st(new R("arguments")),f=new st(new R(d)),v.splat?(p=new st(new R(Ct("slice"))),p.add(new t(new st(new R("call")))),l=new a(p,[n,f]),k=v.value,this.vars.push(k),r=new i(k,l)):(n.add(new L(f)),v.access&&n.add(v.access),v.suffix?(s.push(v.value),k=this.newParam(),v.suffix instanceof L?(y=new L(this.newParam()),s.push(v.suffix.index)):y=v.suffix,k.add(y)):(w=v.value.compile(e,I),"_"===w?(k=new st(new R(ft["const"].deferrals)),k.add(new t(new st(new R(ft["const"].retslot))))):(k=v.value,this.vars.push(k))),r=new i(k,n)),c.push(r);return u=new o(c),m=new h([],u,"icedgen"),g=new o([new q(m)]),b=new h(this.params,g,"icedgen"),l=new a(b,s)},n.prototype.transform=function(e){var n,s,r,o,c,u,h,l,p,d;return d=new st(new R(ft["const"].defer_method)),this.custom?u=d:(u=new st(new R(ft["const"].deferrals)),u.add(new t(d))),s=[],(n=this.makeAssignFn(e))&&s.push(new i(new st(new R(ft["const"].assign_fn)),n,"object")),l=new st(new R(ft["const"].lineno)),p=new st(new R(this.lineno)),h=new i(l,p,"object"),s.push(h),this.custom&&(o=new st(new R(ft["const"].context)),c=new st(new R(ft["const"].deferrals)),r=new i(o,c,"object"),s.push(r)),e=new B(s),new a(u,[new st(e)])},n.prototype.compileNode=function(e){var t,n,i,s,r,o,a;for(t=this.transform(e),a=this.vars,r=0,o=a.length;o>r;r++)s=a[r],n=s.compile(e,E),i=e.scope,i.add(n,"var");return t.compileNode(e)},n.prototype.icedWalkAst=function(e,t){return this.icedHasAutocbFlag=t.foundAutocb,t.foundDefer=!0,this.parentFunc=t.currFunc,n.__super__.icedWalkAst.call(this,e,t)},n}(r),e.Await=s=function(e){function n(e){this.body=e,n.__super__.constructor.call(this)}return Dt(n,e),n.prototype.transform=function(e){var n,s,r,o,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,F,T;return r=this.body,k=ft["const"].deferrals,e.scope.add(k,"var"),b=new st(new R(k)),l=new st(new R(ft["const"].ns)),l.add(new t(new st(new R(ft["const"].Deferrals)))),s=[],(v=null!=(F=this.parentFunc)?F.icedPassedDeferral:void 0)&&(u=new st(new R(ft["const"].parent)),h=new st(new R(v)),c=new i(u,h,"object"),s.push(c)),null!=e.filename&&(d=new st(new R(ft["const"].filename)),f=new st(new R('"'+e.filename.replace("\\","\\\\")+'"')),p=new i(d,f,"object"),s.push(p)),(v=null!=(T=this.parentFunc)?T.icedTraceName():void 0)&&(w=new st(new R(ft["const"].funcname)),g=new st(new R('"'+v+'"')),m=new i(w,g,"object"),s.push(m)),C=new B(s,!0),o=new a(l,[new st(new R(ft["const"].k)),C]),_=new V("new",o),n=new i(b,_),r.unshift(n),y=b.copy().add(new t(new st(new R(ft["const"].fulfill)))),o=new a(y,[]),r.push(o),this.body=r},n.prototype.children=["body"],n.prototype.isStatement=function(){return ot},n.prototype.makeReturn=et,n.prototype.compileNode=function(e){return this.transform(e),this.body.compileNode(e)},n.prototype.icedWalkAst=function(e,t){return this.icedHasAutocbFlag=t.foundAutocb,this.parentFunc=t.currFunc,e=e||this,this.icedParentAwait=e,n.__super__.icedWalkAst.call(this,e,t),this.icedNodeFlag=t.foundAwaitFunc=t.foundAwait=!0},n}(r),_=function(e){function n(e,t){this.foundDefer=e,this.foundAwait=t,n.__super__.constructor.call(this)}return Dt(n,e),n.prototype.compileNode=function(e){var s,r,c,u,l,p,d,f,m,w,g,b,y,v,k,_,C,F,T,L,N,D,E;if(this.expressions=[],k=e.runtime?e.runtime:e.bare?"none":this.foundDefer?"node":"none",!e.runtime||this.foundDefer||e.runforce||(k="none"),C=!1,F=null,d=null,d=function(){switch(k){case"inline":case"window":return"window"===k&&(C=!0),C&&(F=new st(new R(k))),x.generate(F?F.copy():null);case"node":case"browserify":return"browserify"===k?(g="iced-coffee-script/lib/coffee-script/iced",r=ft["const"].runtime):(g="iced-coffee-script",r=ft["const"].ns),p=new R("'"+g+"'"),s=new t(new R(r)),y=new st(new R("require")),u=new a(y,[p]),l=new st(u),l.add(s),b=new st(new R(ft["const"].ns)),new i(b,l);case"none":return null;default:throw SyntaxError("unexpected flag IcedRuntime "+k)}}(),d&&this.push(d),this.foundAwait){for(v=new h([],new o([])),w=[],E=[ft["const"].k_noop,ft["const"].k],T=0,N=E.length;N>T;T++)f=E[T],_=new st(new R(f)),F&&(m=F.copy(),m.add(new t(_)),_=m),w.push(_);for(c=v,L=0,D=w.length;D>L;L++)k=w[L],c=new i(k,c);
this.push(c)}return this.isEmpty()?[]:n.__super__.compileNode.call(this,e)},n.prototype.icedWalkAst=function(e,t){return this.icedHasAutocbFlag=t.foundAutocb,n.__super__.icedWalkAst.call(this,e,t)},n}(o),e.Try=nt=function(e){function t(e,t,n,i){this.attempt=e,this.errorVariable=t,this.recovery=n,this.ensure=i}return Dt(t,e),t.prototype.children=["attempt","recovery","ensure"],t.prototype.isStatement=ot,t.prototype.jumps=function(e){var t;return this.attempt.jumps(e)||(null!=(t=this.recovery)?t.jumps(e):void 0)},t.prototype.makeReturn=function(e){return this.attempt&&(this.attempt=this.attempt.makeReturn(e)),this.recovery&&(this.recovery=this.recovery.makeReturn(e)),this},t.prototype.compileNode=function(e){var t,n,s,r;return e.indent+=Z,r=this.attempt.compileToFragments(e,I),t=this.recovery?(s=new R("_error"),this.errorVariable?this.recovery.unshift(new i(this.errorVariable,s)):void 0,[].concat(this.makeCode(" catch ("),s.compileToFragments(e),this.makeCode(") {\n"),this.recovery.compileToFragments(e,I),this.makeCode("\n"+this.tab+"}"))):this.ensure||this.recovery?[]:[this.makeCode(" catch (_error) {}")],n=this.ensure?[].concat(this.makeCode(" finally {\n"),this.ensure.compileToFragments(e,I),this.makeCode("\n"+this.tab+"}")):[],[].concat(this.makeCode(""+this.tab+"try {\n"),r,this.makeCode("\n"+this.tab+"}"),t,n)},t}(r),e.Throw=tt=function(e){function t(e){this.expression=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=ot,t.prototype.jumps=P,t.prototype.makeReturn=et,t.prototype.compileNode=function(e){return[].concat(this.makeCode(this.tab+"throw "),this.expression.compileToFragments(e),this.makeCode(";"))},t}(r),e.Existence=m=function(e){function t(e){this.expression=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["expression"],t.prototype.invert=O,t.prototype.compileNode=function(e){var t,n,i,s;return this.expression.front=this.front,i=this.expression.compile(e,A),b.test(i)&&!e.scope.check(i)?(s=this.negated?["===","||"]:["!==","&&"],t=s[0],n=s[1],i="typeof "+i+" "+t+' "undefined" '+n+" "+i+" "+t+" null"):i=""+i+" "+(this.negated?"==":"!=")+" null",[this.makeCode(e.level<=D?i:"("+i+")")]},t}(r),e.Parens=H=function(e){function t(e){this.body=e,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["body"],t.prototype.unwrap=function(){return this.body},t.prototype.isComplex=function(){return this.body.isComplex()},t.prototype.compileNode=function(e){var t,n,i;return n=this.body.unwrap(),n instanceof st&&n.isAtomic()?(n.front=this.front,n.compileToFragments(e)):(i=n.compileToFragments(e,S),t=e.level<A&&(n instanceof V||n instanceof a||n instanceof g&&n.returns),t?i:this.wrapInBraces(i))},t}(r),e.For=g=function(e){function s(e,t){var n;s.__super__.constructor.call(this),this.source=t.source,this.guard=t.guard,this.step=t.step,this.name=t.name,this.index=t.index,this.body=o.wrap([e]),this.own=!!t.own,this.object=!!t.object,this.object&&(n=[this.index,this.name],this.name=n[0],this.index=n[1]),this.index instanceof st&&this.index.error("index cannot be a pattern matching expression"),this.range=this.source instanceof st&&this.source.base instanceof W&&!this.source.properties.length,this.pattern=this.name instanceof st,this.range&&this.index&&this.index.error("indexes do not apply to range loops"),this.range&&this.pattern&&this.name.error("cannot pattern match over range loops"),this.own&&!this.object&&this.index.error("cannot use own with for-in"),this.returns=!1}return Dt(s,e),s.prototype.children=["body","source","guard","step"],s.prototype.compileNode=function(e){var t,n,s,r,a,c,u,h,l,p,d,f,m,w,g,y,v,k,_,C,T,L,x,N,D,A,S,$,O,P,j,B,V,M;return t=o.wrap([this.body]),k=null!=(V=mt(t.expressions))?V.jumps():void 0,k&&k instanceof q&&(this.returns=!1),S=this.range?this.source.base:this.source,A=e.scope,C=this.name&&this.name.compile(e,E),w=this.index&&this.index.compile(e,E),C&&!this.pattern&&A.find(C),w&&A.find(w),this.returns&&(D=A.freeVariable("results")),g=this.object&&w||A.freeVariable("i"),y=this.range&&C||w||g,v=y!==g?""+y+" = ":"",this.step&&!this.range&&(M=this.cacheToCodeFragments(this.step.cache(e,E)),$=M[0],P=M[1],O=P.match(G)),this.pattern&&(C=g),B="",d="",u="",f=this.tab+Z,S.icedStatementAssertion(),this.icedNodeFlag?this.icedCompileIced(e,{stepVar:P,body:t,rvar:D,kvar:y,guard:this.guard}):(this.range?p=S.compileToFragments(gt(e,{index:g,name:C,step:this.step})):(j=this.source.compile(e,E),!C&&!this.own||b.test(j)||(u+=""+this.tab+(L=A.freeVariable("ref"))+" = "+j+";\n",j=L),C&&!this.pattern&&(T=""+C+" = "+j+"["+y+"]"),this.object||($!==P&&(u+=""+this.tab+$+";\n"),this.step&&O&&(l=0>+O)||(_=A.freeVariable("len")),a=""+v+g+" = 0, "+_+" = "+j+".length",c=""+v+g+" = "+j+".length - 1",s=""+g+" < "+_,r=""+g+" >= 0",this.step?(O?l&&(s=r,a=c):(s=""+P+" > 0 ? "+s+" : "+r,a="("+P+" > 0 ? ("+a+") : "+c+")"),m=""+g+" += "+P):m=""+(y!==g?"++"+g:""+g+"++"),p=[this.makeCode(""+a+"; "+s+"; "+v+m)])),this.returns&&(x=""+this.tab+D+" = [];\n",N=this.icedHasAutocbFlag?"\n"+this.tab+ft["const"].autocb+"("+D+"); return;":"\n"+this.tab+"return "+D+";",t.makeReturn(D)),this.guard&&(t.expressions.length>1?t.expressions.unshift(new F(new H(this.guard).invert(),new R("continue"))):this.guard&&(t=o.wrap([new F(this.guard,t)]))),this.pattern&&t.expressions.unshift(new i(this.name,new R(""+j+"["+y+"]"))),h=[].concat(this.makeCode(u),this.pluckDirectCall(e,t)),T&&(B="\n"+f+T+";"),this.object&&(p=[this.makeCode(""+y+" in "+j)],this.own&&(d="\n"+f+"if (!"+Ct("hasProp")+".call("+j+", "+y+")) continue;")),n=t.compileToFragments(gt(e,{indent:f}),I),n&&n.length>0&&(n=[].concat(this.makeCode("\n"),n,this.makeCode("\n"))),[].concat(h,this.makeCode(""+(x||"")+this.tab+"for ("),p,this.makeCode(") {"+d+B),n,this.makeCode(""+this.tab+"}"+(N||""))))},s.prototype.pluckDirectCall=function(e,t){var n,s,r,o,c,u,l,p,d,f,m,w,g,b,y;for(s=[],f=t.expressions,c=p=0,d=f.length;d>p;c=++p)r=f[c],r=r.unwrapAll(),r instanceof a&&(l=r.variable.unwrapAll(),(l instanceof h||l instanceof st&&(null!=(m=l.base)?m.unwrapAll():void 0)instanceof h&&1===l.properties.length&&("call"===(w=null!=(g=l.properties[0].name)?g.value:void 0)||"apply"===w))&&(o=(null!=(b=l.base)?b.unwrapAll():void 0)||l,u=new R(e.scope.freeVariable("fn")),n=new st(u),l.base&&(y=[n,l],l.base=y[0],n=y[1]),t.expressions[c]=new a(n,r.args),s=s.concat(this.makeCode(this.tab),new i(u,o).compileToFragments(e,I),this.makeCode(";\n"))));return s},s.prototype.icedCompileIced=function(e,r){var a,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,F,T,x,N,D,E,A,S,I,$,O,P,j,B,M,H,U,W,q,G;return d=r.body,f=null,b=[],G=null,W=e.scope,P=new o([]),this.object?(j=W.freeVariable("ref"),B=new st(new R(j)),a=new i(B,this.source),C=W.freeVariable("keys"),x=new st(new R(C)),v=W.freeVariable("k"),k=new R(v),_=new st(k),m=new st(new n),S=new o([_]),$={object:!0,name:k,source:B},I=new s(S,$),c=new i(x,I),g=W.freeVariable("i"),y=new st(new R(g)),u=new i(y,new st(new R(0))),b=[a,c,u],T=x.copy(),T.add(new t(new st(new R("length")))),f=new V("<",y,T),G=new V("++",y),this.name&&(q=B.copy(),q.add(new L(this.index)),l=new i(this.name,q),P.unshift(l)),F=x.copy(),F.add(new L(y)),h=new i(this.index,F),P.unshift(h)):this.range&&this.name?(O=this.source.base.from<=this.source.base.to,H=this.source.base.exclusive?O?"<":">":O?"<=":">=",f=new V(H,this.name,this.source.base.to),b=[new i(this.name,this.source.base.from)],G=null!=this.step?new V(O?"+=":"-=",this.name,this.step):new V(O?"++":"--",this.name)):!this.range&&this.name&&(N=new st(new R(r.kvar)),D=W.freeVariable("len"),j=W.freeVariable("ref"),B=new st(new R(j)),A=new st(new R(D)),a=new i(B,this.source),E=B.copy().add(new t(new st(new R("length")))),c=new i(A,E),u=new i(N,new st(new R(0))),b=[a,c,u],f=new V("<",N,A),G=new V("++",N),M=B.copy(),M.add(new L(N)),h=new i(this.name,M),P.unshift(h)),U=r.rvar,w=r.guard,p=this.icedWrap({condition:f,body:d,init:b,step:G,rvar:U,guard:w,pre_body:P}),p.compileNode(e)},s}(rt),e.Switch=Q=function(e){function t(e,n,i){this.subject=e,this.cases=n,this.otherwise=i,t.__super__.constructor.call(this)}return Dt(t,e),t.prototype.children=["subject","cases","otherwise"],t.prototype.isStatement=ot,t.prototype.jumps=function(e){var t,n,i,s,r,o,a;for(null==e&&(e={block:!0}),r=this.cases,i=0,s=r.length;s>i;i++)if(o=r[i],n=o[0],t=o[1],t.jumps(e))return t;return null!=(a=this.otherwise)?a.jumps(e):void 0},t.prototype.makeReturn=function(e){var t,n,i,s,r;for(s=this.cases,n=0,i=s.length;i>n;n++)t=s[n],t[1].makeReturn(e);return e&&(this.otherwise||(this.otherwise=new o([new R("void 0")]))),null!=(r=this.otherwise)&&r.makeReturn(e),this},t.prototype.compileNode=function(e){var t,n,i,s,r,o,a,c,u,h,l,p,d,f,m,w;for(this.subject&&this.subject.icedStatementAssertion(),c=e.indent+Z,u=e.indent=c+Z,o=[].concat(this.makeCode(this.tab+"switch ("),this.subject?this.subject.compileToFragments(e,S):this.makeCode("false"),this.makeCode(") {\n")),f=this.cases,a=h=0,p=f.length;p>h;a=++h){for(m=f[a],s=m[0],t=m[1],w=pt([s]),l=0,d=w.length;d>l;l++)i=w[l],this.subject||(i=i.invert()),o=o.concat(this.makeCode(c+"case "),i.compileToFragments(e,S),this.makeCode(":\n"));if((n=t.compileToFragments(e,I)).length>0&&(o=o.concat(n,this.makeCode("\n"))),a===this.cases.length-1&&!this.otherwise)break;r=this.lastNonComment(t.expressions),r instanceof q||r instanceof R&&r.jumps()&&"debugger"!==r.value||o.push(i.makeCode(u+"break;\n"))}return this.otherwise&&this.otherwise.expressions.length&&o.push.apply(o,[this.makeCode(c+"default:\n")].concat(At.call(this.otherwise.compileToFragments(e,I)),[this.makeCode("\n")])),o.push(this.makeCode(this.tab+"}")),o},t.prototype.icedCallContinuation=function(){var e,t,n,i,s,r;for(s=this.cases,n=0,i=s.length;i>n;n++)r=s[n],t=r[0],e=r[1],e.icedThreadReturn();return null!=this.otherwise?this.otherwise.icedThreadReturn():this.otherwise=new o([new C])},t}(r),e.If=F=function(e){function t(e,n,i){this.body=n,null==i&&(i={}),t.__super__.constructor.call(this),this.condition="unless"===i.type?e.invert():e,this.elseBody=null,this.isChain=!1,this.soak=i.soak}return Dt(t,e),t.prototype.children=["condition","body","elseBody"],t.prototype.bodyNode=function(){var e;return null!=(e=this.body)?e.unwrap():void 0},t.prototype.elseBodyNode=function(){var e;return null!=(e=this.elseBody)?e.unwrap():void 0},t.prototype.addElse=function(e){return this.isChain?this.elseBodyNode().addElse(e):(this.isChain=e instanceof t,this.elseBody=this.ensureBlock(e),this.elseBody.updateLocationDataIfMissing(e.locationData)),this},t.prototype.isStatement=function(e){var t;return(null!=e?e.level:void 0)===I||this.bodyNode().isStatement(e)||(null!=(t=this.elseBodyNode())?t.isStatement(e):void 0)},t.prototype.jumps=function(e){var t;return this.body.jumps(e)||(null!=(t=this.elseBody)?t.jumps(e):void 0)},t.prototype.compileNode=function(e){return this.condition.icedStatementAssertion(),this.isStatement(e||this.icedIsCpsPivot())?this.compileStatement(e):this.compileExpression(e)},t.prototype.makeReturn=function(e){return e&&(this.elseBody||(this.elseBody=new o([new R("void 0")]))),this.body&&(this.body=new o([this.body.makeReturn(e)])),this.elseBody&&(this.elseBody=new o([this.elseBody.makeReturn(e)])),this},t.prototype.ensureBlock=function(e){return e instanceof o?e:new o([e])},t.prototype.compileStatement=function(e){var n,i,s,r,o,a,c;return s=ut(e,"chainChild"),(o=ut(e,"isExistentialEquals"))?new t(this.condition.invert(),this.elseBodyNode(),{type:"if"}).compileToFragments(e):(c=e.indent+Z,r=this.condition.compileToFragments(e,S),i=this.ensureBlock(this.body).compileToFragments(gt(e,{indent:c})),a=[].concat(this.makeCode("if ("),r,this.makeCode(") {\n"),i,this.makeCode("\n"+this.tab+"}")),s||a.unshift(this.makeCode(this.tab)),this.elseBody?(n=a.concat(this.makeCode(" else ")),this.isChain?(e.chainChild=!0,n=n.concat(this.elseBody.unwrap().compileToFragments(e,I))):n=n.concat(this.makeCode("{\n"),this.elseBody.compileToFragments(gt(e,{indent:c}),I),this.makeCode("\n"+this.tab+"}")),n):a)},t.prototype.compileExpression=function(e){var t,n,i,s;return i=this.condition.compileToFragments(e,D),n=this.bodyNode().compileToFragments(e,E),t=this.elseBodyNode()?this.elseBodyNode().compileToFragments(e,E):[this.makeCode("void 0")],s=i.concat(this.makeCode(" ? "),n,this.makeCode(" : "),t),e.level>=D?this.wrapInBraces(s):s},t.prototype.unfoldSoak=function(){return this.soak&&this},t.prototype.icedCallContinuation=function(){return this.elseBody?(this.elseBody.icedThreadReturn(),this.isChain=!1):this.addElse(new C),this.body.icedThreadReturn()},t}(r),u={wrap:function(e,n,i){var s,r,c,u,l;return e.jumps()?e:(u=new h([],o.wrap([e])),s=[],r=e.contains(this.isLiteralArguments),r&&e.classBody&&r.error("Class bodies shouldn't reference arguments"),(r||e.contains(this.isLiteralThis))&&(l=new R(r?"apply":"call"),s=[new R("this")],r&&s.push(new R("arguments")),u=new st(u,[new t(l)])),u.noReturn=i,c=new a(u,s),n?o.wrap([c]):c)},isLiteralArguments:function(e){return e instanceof R&&"arguments"===e.value&&!e.asKey},isLiteralThis:function(e){return e instanceof R&&"this"===e.value&&!e.asKey||e instanceof h&&e.bound||e instanceof a&&e.isSuper}},_t=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new st(t),i},d={wrap:function(e,t,n,i){var s,r,c,u,l,p;return p=new h([new M(new R(ft["const"].k))],o.wrap([e]),"icedgen"),s=[],n&&(n.bindName(i),s.push(n)),r=o.wrap([t]),u=(l=r.icedGetSingle())&&l instanceof C&&l.canInline()?l.extractFunc():new h(s,r,"icedgen"),c=new a(p,[u]),new o([c])}},C=function(e){function t(e,n){this.func=e,null==n&&(n=null),t.__super__.constructor.call(this),this.func||(this.func=ft["const"].k),this.value=n}return Dt(t,e),t.prototype.children=["value"],t.prototype.assignValue=function(e){return this.value=e},t.prototype.canInline=function(){return!this.value||this.value instanceof k},t.prototype.literalFunc=function(){return new R(this.func)},t.prototype.extractFunc=function(){return new st(this.literalFunc())},t.prototype.compileNode=function(e){var t,n,i;return n=this.literalFunc(),i=e.level===I?this.value?new o([this.value,new a(n)]):new a(n):(t=this.value?[this.value]:[],new a(n,t)),i.compileNode(e)},t}(r),k=function(e){function t(){t.__super__.constructor.call(this,null,null,!1)}return Dt(t,e),t.counter=0,t.prototype.bindName=function(e){var n;return n=""+e.scope.freeVariable(ft["const"].param,!1)+"_"+t.counter++,this.name=new R(n)},t.prototype.compile=function(e){return this.name||this.bindName(e),t.__super__.compile.call(this,e)},t}(M),x={generate:function(e){var n,s,r,u,l,p,d,f,m,w,g,b,y,v,k,_,C,T,L,x,N,D,E,A,S,I,$,O,P,H,U,W,q,G,X,Y,z,K,J,Q,Z,et,tt,nt,it,rt,ot,at,ct,ut,ht,lt,pt,dt,mt,wt,gt,bt,yt,vt;return Y=new R("continuation"),m=new R("count"),f=new st(new R(ft["const"].Deferrals)),tt=new st(new R(ft["const"].ns)),e&&(e.add(new t(tt)),tt=e),z=new st(new R("this")),z.add(new t(Y)),at=new M(z),w=new st(new R("this")),w.add(new t(m)),ct=new st(new R("this")),ct.add(new t(new st(new R(ft["const"].retslot)))),n=new i(w,new st(new R(1))),s=new i(ct,j()),k=[at],b=new o([n,s]),y=new h(k,b),v=new st(new R("constructor")),g=new i(v,y),H=new a(z,[ct]),O=new o([H]),_=new V("--",w),P=new V("!",_),Z=new F(P,O),wt=new o([Z]),bt=new h([],wt),vt=new st(new R(ft["const"].fulfill)),mt=new i(vt,bt),U=new V("++",w),X=new R("inner_params"),D=new R("defer_params"),E=new st(D),d=new st(D),r=new R(ft["const"].assign_fn),d.add(new t(r,"soak")),Q=new R("apply"),d.add(new t(Q,"soak")),et=j(),u=new a(d,[et,new st(X)]),yt=new st(new R("this")),yt.add(new t(new R(ft["const"].fulfill))),gt=new a(yt,[]),W=new o([u,gt]),G=[new M(X,null,!0)],q=new h(G,W,"boundfunc"),T=new o([U,q]),N=[new M(D)],L=new h(N,T),x=new st(new R(ft["const"].defer_method)),C=new i(x,L),l=[g,mt,C],rt=new B(l,!0),p=new o([new st(rt)]),K=new c(null,null,p),J=new i(f,K,"object"),ot=new o([j()]),I=new h([],ot),$=new st(new R(ft["const"].findDeferral)),S=new i($,I,"object"),A=new R("_fn"),ht=new o([new a(new st(A),[])]),dt=[new M(A)],lt=new h(dt,ht),pt=new st(new R(ft["const"].trampoline)),ut=new i(pt,lt,"object"),nt=new B([J,S,ut],!0),it=new st(nt),new i(tt,it)}},it={"extends":function(){return"function(child, parent) { for (var key in parent) { if ("+Ct("hasProp")+".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},bind:function(){return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"},indexOf:function(){return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"},hasProp:function(){return"{}.hasOwnProperty"},slice:function(){return"[].slice"}},I=1,S=2,E=3,D=4,A=5,N=6,Z="  ",y="[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",b=RegExp("^"+y+"$"),G=/^[+-]?\d+$/,$=RegExp("^(?:("+y+")\\.prototype(?:\\.("+y+")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\]))|("+y+")$"),v=/^['"]/,Ct=function(e){var t;return t="__"+e,Y.root.assign(t,it[e]()),t},bt=function(e,t){return e=e.replace(/\n/g,"$&"+t),e.replace(/\s+$/,"")}}.call(this),t.exports}(),require["./sourcemap"]=function(){var e={},t={exports:e};return function(){var t,n;t=function(){function e(e){this.line=e,this.columns=[]}return e.prototype.add=function(e,t,n){var i,s;return s=t[0],i=t[1],null==n&&(n={}),this.columns[e]&&n.noReplace?void 0:this.columns[e]={line:this.line,column:e,sourceLine:s,sourceColumn:i}},e.prototype.sourceLocation=function(e){for(var t;!((t=this.columns[e])||0>=e);)e--;return t&&[t.sourceLine,t.sourceColumn]},e}(),n=function(){function e(){this.lines=[]}var n,i,s,r;return e.prototype.add=function(e,n,i){var s,r,o,a;return null==i&&(i={}),r=n[0],s=n[1],o=(a=this.lines)[r]||(a[r]=new t(r)),o.add(s,e,i)},e.prototype.sourceLocation=function(e){var t,n,i;for(n=e[0],t=e[1];!((i=this.lines[n])||0>=n);)n--;return i&&i.sourceLocation(t)},e.prototype.generate=function(e,t){var n,i,s,r,o,a,c,u,h,l,p,d,f,m,w,g;for(null==e&&(e={}),null==t&&(t=null),l=0,i=0,r=0,s=0,u=!1,n="",w=this.lines,a=p=0,f=w.length;f>p;a=++p)if(o=w[a])for(g=o.columns,d=0,m=g.length;m>d;d++)if(c=g[d]){for(;l<c.line;)i=0,u=!1,n+=";",l++;u&&(n+=",",u=!1),n+=this.encodeVlq(c.column-i),i=c.column,n+=this.encodeVlq(0),n+=this.encodeVlq(c.sourceLine-r),r=c.sourceLine,n+=this.encodeVlq(c.sourceColumn-s),s=c.sourceColumn,u=!0}return h={version:3,file:e.generatedFile||"",sourceRoot:e.sourceRoot||"",sources:e.sourceFiles||[""],names:[],mappings:n},e.inline&&(h.sourcesContent=[t]),JSON.stringify(h,null,2)},s=5,i=1<<s,r=i-1,e.prototype.encodeVlq=function(e){var t,n,o,a;for(t="",o=0>e?1:0,a=(Math.abs(e)<<1)+o;a||!t;)n=a&r,a>>=s,a&&(n|=i),t+=this.encodeBase64(n);return t},n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e.prototype.encodeBase64=function(e){return n[e]||function(){throw new Error("Cannot Base64 encode value: "+e)}()},e}(),e.SourceMap=n}.call(this),t.exports}(),require["./coffee-script"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,u,h,l,p,d,f,m,w,g,b,y,v,k,_,C,F={}.hasOwnProperty,T=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};if(p=require("fs"),k=require("vm"),y=require("path"),s=require("child_process"),t=require("./lexer").Lexer,b=require("./parser").parser,f=require("./helpers"),i=require("./sourcemap").SourceMap,m=require("./iced"),e.VERSION="1.6.3-g",c=[".coffee",".litcoffee",".coffee.md",".iced"],e.helpers=f,e.compile=r=function(e,t){var n,s,r,o,a,c,u,h,l,p,d,g;for(null==t&&(t={}),l=f.merge,t.sourceMap&&(h=new i),a=m.transform(b.parse(w.tokenize(e,t))).compileToFragments(t),r=0,t.header&&(r+=1),t.shiftLine&&(r+=1),s=0,u="",d=0,g=a.length;g>d;d++)o=a[d],t.sourceMap&&(o.locationData&&h.add([o.locationData.first_line,o.locationData.first_column],[r,s],{noReplace:!0}),p=f.count(o.code,"\n"),r+=p,s=o.code.length-(p?o.code.lastIndexOf("\n"):0)),u+=o.code;return t.header&&(c="Generated by IcedCoffeeScript "+this.VERSION,u="// "+c+"\n"+u),t.sourceMap?(n={js:u},n.sourceMap=h,n.v3SourceMap=h.generate(t,e),n):u},e.tokens=function(e,t){return w.tokenize(e,t)},e.nodes=function(e,t){return"string"==typeof e?m.transform(b.parse(w.tokenize(e,t)),t):m.transform(b.parse(e),t)},e.run=function(e,t){var n,i,s;return null==t&&(t={}),i=require.main,i.filename=process.argv[1]=t.filename?p.realpathSync(t.filename):".",i.moduleCache&&(i.moduleCache={}),i.paths=require("module")._nodeModulePaths(y.dirname(p.realpathSync(t.filename||"."))),(!f.isCoffee(i.filename)||require.extensions)&&(n=r(e,t),e=null!=(s=n.js)?s:n),i._compile(e,i.filename)},e.eval=function(e,t){var n,i,s,o,a,c,u,h,l,p,d,f,m,w;if(null==t&&(t={}),e=e.trim()){if(i=k.Script){if(null!=t.sandbox){if(t.sandbox instanceof i.createContext().constructor)u=t.sandbox;else{u=i.createContext(),f=t.sandbox;for(o in f)F.call(f,o)&&(h=f[o],u[o]=h)}u.global=u.root=u.GLOBAL=u}else u=global;if(u.__filename=t.filename||"eval",u.__dirname=y.dirname(u.__filename),u===global&&!u.module&&!u.require){for(n=require("module"),u.module=d=new n(t.modulename||"eval"),u.require=w=function(e){return n._load(e,d,!0)},d.filename=u.__filename,m=Object.getOwnPropertyNames(require),l=0,p=m.length;p>l;l++)c=m[l],"paths"!==c&&(w[c]=require[c]);w.paths=d.paths=n._nodeModulePaths(process.cwd()),w.resolve=function(e){return n._resolveFilename(e,d)}}}a={};for(o in t)F.call(t,o)&&(h=t[o],a[o]=h);return a.bare=!0,s=r(e,a),u===global?k.runInThisContext(s):k.runInContext(s,u)}},o=function(e,t){var n,i,s,o;s=p.readFileSync(e,"utf8"),o=65279===s.charCodeAt(0)?s.substring(1):s;try{n=r(o,{filename:e,sourceMap:t,literate:f.isLiterate(e)})}catch(a){throw i=a,i.filename=e,i.code=o,i}return n},g=function(e,t){var n;return n=o(t,!1),e._compile(n,t)},require.extensions){for(_=0,C=c.length;C>_;_++)a=c[_],require.extensions[a]=g;n=require("module"),u=function(e){var t,i;for(i=y.basename(e).split("."),""===i[0]&&i.shift();i.shift();)if(t="."+i.join("."),n._extensions[t])return t;return".js"},n.prototype.load=function(e){var t;return this.filename=e,this.paths=n._nodeModulePaths(y.dirname(e)),t=u(e),n._extensions[t](this,e),this.loaded=!0}}s&&(h=s.fork,s.fork=function(e,t,n){var i;return null==t&&(t=[]),null==n&&(n={}),i=f.isCoffee(e)?"coffee":null,Array.isArray(t)||(t=[],n=t||{}),n.execPath||(n.execPath=i),h(e,t,n)}),w=new t,b.lexer={lex:function(){var e,t;return t=this.tokens[this.pos++],t?(e=t[0],this.yytext=t[1],this.yylloc=t[2],this.yylineno=this.yylloc.first_line):e="",e},setInput:function(e){return this.tokens=e,this.pos=0},upcomingInput:function(){return""}},b.yy=require("./nodes"),e.iced=m.runtime,b.yy.parseError=function(e,t){var n;return n=t.token,e="unexpected "+(1===n?"end of input":n),f.throwSyntaxError(e,b.lexer.yylloc)},l=function(e,t){var n,i,s,r,o,a,c,u,h,l,p,d;return r=void 0,s="",e.isNative()?s="native":(e.isEval()?(r=e.getScriptNameOrSourceURL(),r||(s=""+e.getEvalOrigin()+", ")):r=e.getFileName(),r||(r="<anonymous>"),u=e.getLineNumber(),i=e.getColumnNumber(),l=t(r,u,i),s=l?""+r+":"+l[0]+":"+l[1]:""+r+":"+u+":"+i),o=e.getFunctionName(),a=e.isConstructor(),c=!(e.isToplevel()||a),c?(h=e.getMethodName(),d=e.getTypeName(),o?(p=n="",d&&o.indexOf(d)&&(p=""+d+"."),h&&o.indexOf("."+h)!==o.length-h.length-1&&(n=" [as "+h+"]"),""+p+o+n+" ("+s+")"):""+d+"."+(h||"<anonymous>")+" ("+s+")"):a?"new "+(o||"<anonymous>")+" ("+s+")":o?""+o+" ("+s+")":s},v={},d=function(e){var t,n;if(v[e])return v[e];if(n=null!=y?y.extname(e):void 0,!(T.call(c,n)<0))return t=o(e,!0),v[e]=t.sourceMap},Error.prepareStackTrace=function(t,n){var i,s,r,o;return r=function(e,t,n){var i,s;return s=d(e),s&&(i=s.sourceLocation([t-1,n-1])),i?[i[0]+1,i[1]+1]:null},s=function(){var t,s,o;for(o=[],t=0,s=n.length;s>t&&(i=n[t],i.getFunction()!==e.run);t++)o.push("  at "+l(i,r));return o}(),""+t.name+": "+(null!=(o=t.message)?o:"")+"\n"+s.join("\n")+"\n"}}.call(this),t.exports}(),require["./browser"]=function(){var exports={},module={exports:exports};return function(){var CoffeeScript,compile,runScripts,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};CoffeeScript=require("./coffee-script"),CoffeeScript.require=require,compile=CoffeeScript.compile,CoffeeScript.eval=function(code,options){return null==options&&(options={}),null==options.bare&&(options.bare=!0),eval(compile(code,options))},CoffeeScript.run=function(e,t){return null==t&&(t={}),t.bare=!0,t.shiftLine=!0,Function(compile(e,t))()},"undefined"!=typeof window&&null!==window&&("undefined"!=typeof btoa&&null!==btoa&&"undefined"!=typeof JSON&&null!==JSON&&"undefined"!=typeof unescape&&null!==unescape&&"undefined"!=typeof encodeURIComponent&&null!==encodeURIComponent&&(compile=function(e,t){var n,i,s;return null==t&&(t={}),t.sourceMap=!0,t.inline=!0,s=CoffeeScript.compile(e,t),n=s.js,i=s.v3SourceMap,""+n+"\n//# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(i)))+"\n//# sourceURL=coffeescript"}),CoffeeScript.load=function(e,t,n){var i;return null==n&&(n={}),n.sourceFiles=[e],i=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest,i.open("GET",e,!0),"overrideMimeType"in i&&i.overrideMimeType("text/plain"),i.onreadystatechange=function(){var s;if(4===i.readyState){if(0!==(s=i.status)&&200!==s)throw new Error("Could not load "+e);if(CoffeeScript.run(i.responseText,n),t)return t()}},i.send(null)},runScripts=function(){var e,t,n,i,s,r,o;return o=window.document.getElementsByTagName("script"),t=["text/coffeescript","text/literate-coffeescript"],e=function(){var e,n,i,s;for(s=[],e=0,n=o.length;n>e;e++)r=o[e],i=r.type,__indexOf.call(t,i)>=0&&s.push(r);return s}(),i=0,s=e.length,(n=function(){var s,r,o;return o=e[i++],s=null!=o?o.type:void 0,__indexOf.call(t,s)>=0?(r={literate:"text/literate-coffeescript"===s},o.src?CoffeeScript.load(o.src,n,r):(r.sourceFiles=["embedded"],CoffeeScript.run(o.innerHTML,r),n())):void 0})(),null},window.addEventListener?window.addEventListener("DOMContentLoaded",runScripts,!1):window.attachEvent("onload",runScripts))}.call(this),module.exports}(),require["./icedlib"]=function(){var e={},t={exports:e};return function(){var t,n,i,s,r,o,a,c,u=[].slice;s=r=function(){},i=require("./iced"),e.iced=n=i.runtime,c=function(e,t,i,s){var o,a,c,h,l,p;p=r,h=n.findDeferral(arguments),a=new n.Rendezvous,s[0]=a.id(!0).defer({assign_fn:function(){return function(){return o=u.call(arguments,0)}}(),lineno:17,context:l}),setTimeout(a.id(!1).defer({lineno:18,context:l}),t),function(e){l=new n.Deferrals(e,{parent:h,filename:"src/icedlib.coffee",funcname:"_timeout"}),a.wait(l.defer({assign_fn:function(){return function(){return c=arguments[0]}}(),lineno:19})),l._fulfill()}(function(){return i&&(i[0]=c),e.apply(null,o)})},e.timeout=function(e,t,n){var i;return i=[],c(e,t,n,i),i[0]},o=function(e,t,i){var s,o,a,c;c=r,o=n.findDeferral(arguments),function(e){a=new n.Deferrals(e,{parent:o,filename:"src/icedlib.coffee",funcname:"_iand"}),i[0]=a.defer({assign_fn:function(){return function(){return s=arguments[0]}}(),lineno:34}),a._fulfill()}(function(){return s||(t[0]=!1),e()})},e.iand=function(e,t){var n;return n=[],o(e,t,n),n[0]},a=function(e,t,i){var s,o,a,c;c=r,o=n.findDeferral(arguments),function(e){a=new n.Deferrals(e,{parent:o,filename:"src/icedlib.coffee",funcname:"_ior"}),i[0]=a.defer({assign_fn:function(){return function(){return s=arguments[0]}}(),lineno:51}),a._fulfill()}(function(){return s&&(t[0]=!0),e()})},e.ior=function(e,t){var n;return n=[],a(e,t,n),n[0]},e.Pipeliner=t=function(){function e(e,t){this.window=e||1,this.delay=t||0,this.queue=[],this.n_out=0,this.cb=null,this[i["const"].deferrals]=this,this.defer=this._defer}return e.prototype.waitInQueue=function(e){var t,i,s,o=this;s=r,t=n.findDeferral(arguments),function(e){var s,r;s=[],r=function(e){var a,c,u;return a=function(){return e(s)},c=function(){return n.trampoline(function(){return r(e)})},u=function(e){return s.push(e),c()},o.n_out>=o.window?(!function(e){i=new n.Deferrals(e,{parent:t,filename:"src/icedlib.coffee",funcname:"Pipeliner.waitInQueue"}),o.cb=i.defer({lineno:88}),i._fulfill()}(u),void 0):a()},r(e)}(function(){o.n_out++,function(e){return o.delay?(!function(e){i=new n.Deferrals(e,{parent:t,filename:"src/icedlib.coffee",funcname:"Pipeliner.waitInQueue"}),setTimeout(i.defer({lineno:96}),o.delay),i._fulfill()}(e),void 0):e()}(function(){return e()})})},e.prototype.__defer=function(e,t){var i,s,o,a,c,h=this;c=r,o=n.findDeferral(arguments),function(i){a=new n.Deferrals(i,{parent:o,filename:"src/icedlib.coffee",funcname:"Pipeliner.__defer"}),s=a.defer({lineno:109}),e[0]=function(){var e,n;return e=1<=arguments.length?u.call(arguments,0):[],null!=(n=t.assign_fn)&&n.apply(null,e),s()},a._fulfill()}(function(){return h.n_out--,h.cb?(i=h.cb,h.cb=null,i()):void 0})},e.prototype._defer=function(e){var t;return t=[],this.__defer(t,e),t[0]},e.prototype.flush=function(e){var t,i,s,r,o,a=this;s=e,t=n.findDeferral(arguments),r=[],o=function(e){var s,c,u;return s=function(){return e(r)},c=function(){return n.trampoline(function(){return o(e)})},u=function(e){return r.push(e),c()},a.n_out?(!function(e){i=new n.Deferrals(e,{parent:t,filename:"src/icedlib.coffee",funcname:"Pipeliner.flush"}),a.cb=i.defer({lineno:136}),i._fulfill()}(u),void 0):s()},o(s)},e}()}.call(this),t.exports}(),require["./coffee-script"]}();"function"==typeof define&&define.amd?(define(function(){return CoffeeScript}),define(function(){return CoffeeScript.iced})):(root.CoffeeScript=CoffeeScript,root.iced=CoffeeScript.iced)}(this);/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);
(function($) {
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

var undefined = {}.undefined;

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

function cleanSwap(elem, options, callback) {
  var ret, name, old = {};
  // Remember the old values, and insert the new ones
  for (name in options) {
    old[name] = elem.style[name];
    elem.style[name] = options[name];
  }
  ret = callback.apply(elem);
  // Revert the old values
  for (name in options) {
    elem.style[name] = cleanedStyle(old[name]);
  }
  return ret;
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
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      substTransform = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
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
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      substTransform = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
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
  var tr = getElementTranslation(elem),
      totalParentTransform = totalTransform2x2(elem.parentElement),
      inverseParent = inverse2x2(totalParentTransform),
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      st = swapout[transform] = (inverseParent ?
          'matrix(' + $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      saved = elem.style[transform],
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
      pos = addVector(matrixVectorProduct(totalParentTransform, tr), origin);
  return {
    pageX: pos[0],
    pageY: pos[1]
  };
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
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      substTransform = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
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
      // Below: support for image loading without messing up origin.
      lastSeenOrigin: null,
      lastSeenOriginTime: null,
      lastSeenOriginTimer: null,
      lastSeenOriginEvent: null
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
      getTurtleData(elem).down = style;
      elem.style.turtlePenDown = writePenDown(style);
      flushPenState(elem);
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
    if (path[j].length) {
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
  if (state.lastSeenOrigin) { fixOriginIfWatching(elem); }
  var center = getCenterInPageCoordinates(elem);
  // Once the pen is down, the origin needs to be stable when the image
  // loads.
  watchImageToFixOriginOnLoad(elem);
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
    // Set the image to a 1x1 transparent GIF before next switching it
    // to the image of interest.
    sel[0].src = 'data:image/gif;base64,R0lGODlhAQABAIAAA' +
                 'AAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    sel.css({
      backgroundImage: 'none',
      height: 'auto',
      width: 'auto'
    });
    sel[0].src = img.url;
    sel.css(img.css);
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
      dx = Math.sin(r) * scaledDistance;
  if (!ts) { return; }
  if (sideways) {
    dy += Math.sin(r) * scaledSideways;
    dx += Math.cos(r) * scaledSideways;
  }
  ts.tx += dx;
  ts.ty += dy;
  elem.style[transform] = writeTurtleTransform(ts);
  flushPenState(elem);
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
          p = (ts.tx + middle[0]) * c + (ts.ty + middle[1]) * s;
      ts.tx = p * c + v * s - middle[0];
      ts.ty = p * s - v * c - middle[1];
      elem.style[transform] = writeTurtleTransform(ts);
      flushPenState(elem);
    }
  };
}

// Finally, add turtle support.
function makeTurtleHook(prop, normalize, unit, displace) {
  return {
    get: function(elem, computed, extra) {
      if (displace) fixOriginIfWatching(elem);
      var ts = readTurtleTransform(elem, computed);
      if (ts) { return ts[prop] + unit; }
    },
    set: function(elem, value) {
      if (displace) fixOriginIfWatching(elem);
      var ts = readTurtleTransform(elem, true) ||
          {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0},
          opt = { displace: displace };
      ts[prop] = normalize(value, elem, ts, opt);
      elem.style[transform] = writeTurtleTransform(ts);
      if (opt.displace) {
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
      splits, splita, absang,
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
  ts.tx += dc[0] - Math.cos(r1r) * radius;
  ts.ty += dc[1] - Math.sin(r1r) * radius;
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
      fixOriginIfWatching(elem);
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
      fixOriginIfWatching(elem);
      var ts = readTurtleTransform(elem, true) ||
              {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
      var parts = (typeof(value) == 'string' ? value.split(/\s+/) : [value]);
      if (parts.length < 1 || parts.length > 2) { return; }
      if (parts.length >= 1) { ts[propx] = parts[0]; }
      if (parts.length >= 2) { ts[propy] = parts[1]; }
      else if (!displace) { ts[propy] = ts[propx]; }
      else { ts[propy] = 0; }
      elem.style[transform] = writeTurtleTransform(ts);
      if (displace) {
        flushPenState(elem);
      }
    }
  };
}

function fixOriginIfWatching(elem) {
  // A function to reposition an image turtle each time its origin
  // changes from the last seen origin, to keep the origin in the
  // same location on the page.
  var state = $.data(elem, 'turtleData');
  if (state && state.lastSeenOrigin) {
    var oldOrigin = state.lastSeenOrigin,
        newOrigin = readTransformOrigin(elem),
        now = $.now();
    if (state.lastSeenOriginEvent && elem.complete) {
      $.event.remove(elem, 'load.turtle', state.lastSeenOriginEvent);
      state.lastSeenOriginEvent = null;
      state.lastSeenOriginTime = now;
    }
    if (newOrigin[0] != oldOrigin[0] || newOrigin[1] != oldOrigin[1]) {
      var ts = readTurtleTransform(elem, true);
      ts.tx += oldOrigin[0] - newOrigin[0];
      ts.ty += oldOrigin[1] - newOrigin[1];
      state.lastSeenOrigin = newOrigin;
      state.lastSeenOriginTime = now;
      elem.style[transform] = writeTurtleTransform(ts);
    } else if (elem.tagName == 'IMG' && !elem.complete) {
      state.lastSeenOriginTime = now;
      if (!state.lastSeenOriginEvent) {
        state.lastSeenOriginEvent = (function() { fixOriginIfWatching(elem); });
        $.event.add(elem, 'load.turtle', state.lastSeenOriginEvent);
      }
    } else if (!state.lastSeenOriginEvent &&
        now - state.lastSeenOriginTime > 1000) {
      // Watch for an additional second after anything interesting;
      // then clear the watcher.
      clearInterval(state.lastSeenOriginTimer);
      state.lastSeenOriginTimer = null;
      state.lastSeenOriginTime = null;
      state.lastSeenOrigin = null;
    }
  }
}

function queueWaitForImageLoad(sel) {
  if (sel[0] && sel[0].tagName == 'IMG' && !sel[0].complete &&
      ((!sel[0].style.width && !sel[0].getAttribute('width'))
       || (!sel[0].style.height && !sel[0].getAttribute('height')))) {
    sel.queue(function() {
      var interval = null;
      function checkIfLoaded() {
        if (sel[0].complete) {
          clearInterval(interval);
          // fixOriginIfWatching(sel[0]);
          sel.dequeue();
        }
      }
      interval = setInterval(checkIfLoaded, 100);
    });
  }
}

function watchImageToFixOriginOnLoad(elem, force) {
  if (!elem || elem.tagName !== 'IMG' ||
      (!force && elem.complete) ||
      $(elem).css('position') != 'absolute') {
    return;
  }
  var state = getTurtleData(elem),
      now = $.now();
  if (state.lastSeenOrigin) {
    // Already tracking: let it continue.
    fixOriginIfWatching(elem);
    return;
  }
  state.lastSeenOrigin = readTransformOrigin(elem);
  state.lastSeenOriginTimer = setInterval(function() {
    fixOriginIfWatching(elem);
  }, 200);
  state.lastSeenOriginTime = $.now();
  fixOriginIfWatching(elem);
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
    fixOriginIfWatching(this);
    var thispos = getCenterInPageCoordinates(this),
        dx = pos.pageX - thispos.pageX,
        dy = pos.pageY - thispos.pageY;
    return within === (dx * dx + dy * dy <= d2);
  });
}

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

var turtlefn = {
  rt: wraphelp(
  ["<u>rt(degrees)</u> Right turn. Pivots clockwise by some degrees: " +
      "<mark>rt 90</mark>",
   "<u>rt(degrees, radius)</u> Right arc. Pivots with a turning radius: " +
      "<mark>rt 90, 50</mark>"],
  function rt(degrees, radius) {
    if (degrees === undefined || degrees === null) {
      degrees = 90;  // zero-argument default.
    }
    if (!radius) {
      return this.plan(function(j, elem) {
        this.animate({turtleRotation: '+=' + cssNum(degrees || 0) + 'deg'},
            animTime(elem), animEasing(elem));
      });
    } else {
      return this.plan(function(j, elem) {
        var oldRadius = this.css('turtleTurningRadius');
        this.css({turtleTurningRadius: (degrees < 0) ? -radius : radius});
        this.animate({turtleRotation: '+=' + cssNum(degrees) + 'deg'},
            animTime(elem), animEasing(elem));
        this.plan(function() {
          this.css({turtleTurningRadius: oldRadius});
        });
      });
    }
  }),
  lt: wraphelp(
  ["<u>lt(degrees)</u> Left turn. Pivots counterclockwise by some degrees: " +
      "<mark>lt 90</mark>",
   "<u>lt(degrees, radius)</u> Left arc. Pivots with a turning radius: " +
      "<mark>lt 90, 50</mark>"],
  function lt(degrees, radius) {
    if (degrees === undefined || degrees === null) {
      degrees = 90;  // zero-argument default.
    }
    if (!radius) {
      return this.plan(function(j, elem) {
        this.animate({turtleRotation: '-=' + cssNum(degrees || 0) + 'deg'},
            animTime(elem), animEasing(elem));
      });
    } else {
      return this.plan(function(j, elem) {
        var oldRadius = this.css('turtleTurningRadius');
        this.css({turtleTurningRadius: (degrees < 0) ? -radius : radius});
        this.animate({turtleRotation: '-=' + cssNum(degrees) + 'deg'},
            animTime(elem), animEasing(elem));
        this.plan(function() {
          this.css({turtleTurningRadius: oldRadius});
        });
      });
    }
  }),
  fd: wraphelp(
  ["<u>fd(pixels)</u> Forward. Moves ahead by some pixels: " +
      "<mark>fd 100</mark>"],
  function fd(amount) {
    if (amount === undefined || amount === null) {
      amount = 100;  // zero-argument default.
    }
    var elem, q, doqueue, atime;
    if (this.length == 1 &&
        ((atime = animTime(elem = this[0])) === 0 ||
          $.fx.speeds[atime] === 0)) {
      q = $.queue(elem);
      doqueue = (q.length > 0);
      function domove() {
        fixOriginIfWatching(elem);
        doQuickMove(elem, amount, 0);
        if (doqueue) { $.dequeue(elem); }
      }
      if (doqueue) {
        domove.finish = domove;
        q.push(domove);
      } else {
        domove();
      }
      return this;
    }
    return this.plan(function(j, elem) {
      fixOriginIfWatching(elem);
      this.animate({turtleForward: '+=' + cssNum(amount || 0) + 'px'},
          animTime(elem), animEasing(elem));
    });
  }),
  bk: wraphelp(
  ["<u>bk(pixels)</u> Back. Moves in reverse by some pixels: " +
      "<mark>bk 100</mark>"],
  function bk(amount) {
    if (amount === undefined || amount === null) {
      amount = 100;  // zero-argument default.
    }
    return this.fd(-amount);
  }),
  slide: wraphelp(
  ["<u>slide(x, y)</u> Slides right x and forward y pixels without turning: " +
      "<mark>slide 50, 100</mark>"],
  function slide(x, y) {
    if ($.isArray(x)) {
      y = x[1];
      x = x[0];
    }
    if (!y) { y = 0; }
    if (!x) { x = 0; }
    return this.plan(function(j, elem) {
      this.animate({turtlePosition:
          displacedPosition(elem, y, x)}, animTime(elem), animEasing(elem));
    });
  }),
  moveto: wraphelp(
  ["<u>moveto(x, y)</u> Move to graphing coordinates (see <u>getxy</u>): " +
      "<mark>moveto 50, 100</mark>",
   "<u>moveto(obj)</u> Move to page coordinates " +
      "or an object on the page (see <u>pagexy</u>): " +
      "<mark>moveto lastmousemove</mark>"],
  function moveto(x, y) {
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
    return this.plan(function(j, elem) {
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
        scrollWindowToDocumentPosition(pos, limit);
        return;
      } else if (elem.nodeType === 9) {
        return;
      }
      this.animate({turtlePosition:
          computeTargetAsTurtlePosition(elem, pos, limit, localx, localy)},
          animTime(elem), animEasing(elem));
    });
  }),
  jump: wraphelp(
  ["<u>jump(x, y)</u> Move without drawing (compare to <u>slide</u>): " +
      "<mark>jump 0, 50</mark>"],
  function jump(x, y) {
    var args = arguments;
    return this.plan(function(j, elem) {
      var down = this.css('turtlePenDown');
      this.css({turtlePenDown: 'up'});
      this.slide.apply(this, args);
      this.plan(function() {
        this.css({turtlePenDown: down});
      });
    });
  }),
  jumpto: wraphelp(
  ["<u>jumpto(x, y)</u> Move without drawing (compare to <u>moveto</u>): " +
      "<mark>jumpto 50, 100</mark>"],
  function jumpto(x, y) {
    var args = arguments;
    return this.plan(function(j, elem) {
      var down = this.css('turtlePenDown');
      this.css({turtlePenDown: 'up'});
      this.moveto.apply(this, args);
      this.plan(function() {
        this.css({turtlePenDown: down});
      });
    });
  }),
  turnto: wraphelp(
  ["<u>turnto(degrees)</u> Turn to a direction. " +
      "North is 0, East is 90: <mark>turnto 270</turnto>",
   "<u>turnto(x, y)</u> Turn to graphing coordinates: " +
      "<mark>turnto 50, 100</mark>",
   "<u>turnto(obj)</u> Turn to page coordinates or an object on the page: " +
      "<mark>turnto lastmousemove</mark>"],
  function turnto(bearing, y) {
    if ($.isNumeric(y) && $.isNumeric(bearing)) {
      // turnto x, y: convert to turnto [x, y].
      bearing = [bearing, y];
      y = null;
    }
    return this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      // turnto bearing: just use the given absolute.
      var limit = null, ts, r,
          targetpos = null, nlocalxy = null;
      if ($.isNumeric(bearing)) {
        r = convertToRadians(bearing);
        fixOriginIfWatching(elem);
        targetpos = getCenterInPageCoordinates(elem);
        targetpos.pageX += Math.sin(r) * 1024;
        targetpos.pageY -= Math.cos(r) * 1024;
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
      this.animate({turtleRotation: dir}, animTime(elem), animEasing(elem));
    });
  }),
  home: wraphelp(
  ["<u>home()</u> Goes home. " +
      "Jumps to the center without drawing: <mark>do home</mark>"],
  function home(container) {
    return this.plan(function(j, elem) {
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
    });
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
    return this.plan(function(j, elem) {
      if (penstyle === false || penstyle === true ||
          penstyle == 'down' || penstyle == 'up') {
        this.css('turtlePenDown', penstyle);
      } else {
        if (lineWidth !== undefined) {
          penstyle += " lineWidth " + lineWidth;
        }
        this.css('turtlePenStyle', penstyle);
      }
    });
  }),
  fill: wraphelp(
  ["<u>fill(color)</u> Fills a path traced using " +
      "<u>pen path</u>: " +
      "<mark>pen path; rt 100, 90; fill blue</mark>"],
  function fill(style) {
    if (!style) { style = 'black'; }
    var ps = parsePenStyle(style, 'fillStyle');
    return this.plan(function(j, elem) {
      endAndFillPenPath(elem, ps);
    });
  }),
  dot: wraphelp(
  ["<u>dot(color, diameter)</u> Draws a dot. " +
      "Color and diameter are optional: " +
      "<mark>dot blue</mark>"],
  function dot(style, diameter) {
    if ($.isNumeric(style)) {
      // Allow for parameters in either order.
      var t = style;
      style = diameter;
      diameter = t;
    }
    if (diameter === undefined) { diameter = 8.8; }
    if (!style) { style = 'black'; }
    var ps = parsePenStyle(style, 'fillStyle');
    return this.plan(function(j, elem) {
      var c = this.pagexy(),
          ts = readTurtleTransform(elem, true),
          extraDiam = (ps.eraseMode ? 2 : 0);
      // Scale by sx.  (TODO: consider parent transforms.)
      fillDot(c, diameter * ts.sx + extraDiam, ps);
      // Once drawing begins, origin must be stable.
      watchImageToFixOriginOnLoad(elem);
    });
  }),
  pause: wraphelp(
  ["<u>pause(seconds)</u> Pauses some seconds before proceeding. " +
      "<mark>fd 100; pause 2.5; bk 100</mark>"],
  function pause(seconds) {
    return this.delay(seconds * 1000);
  }),
  st: wraphelp(
  ["<u>st()</u> Show turtle. The reverse of " +
      "<u>ht()</u>. <mark>do st</mark>"],
  function st() {
    return this.plan(function() { this.show(); });
  }),
  ht: wraphelp(
  ["<u>ht()</u> Hide turtle. The turtle can be shown again with " +
      "<u>st()</u>. <mark>do ht</mark>"],
  function ht() {
    return this.plan(function() { this.hide(); });
  }),
  pu:
  function pu() {
    return this.pen(false);
  },
  pd:
  function pd() {
    return this.pen(true);
  },
  pe:
  function pe() {
    return this.pen('erase');
  },
  pf:
  function pf() {
    return this.pen('path');
  },
  play: wraphelp(
  ["<u>play(notes)</u> Play notes. Notes are specified in " +
      "<a href=\"http://abcnotation.com/\" target=\"_blank\">" +
      "ABC notation</a>.  " +
      "<mark>play \"de[dBFA]2[cGEC]4\"</mark>"],
  function play(notes) {
    var args = arguments;
    return this.queue(function() {
      // playABC will call $(this).dequeue() when song is done.
      playABC(this, args);
    });
  }),
  speed: wraphelp(
  ["<u>speed(persec)</u> Set one turtle's speed in moves per second: " +
      "<mark>turtle.speed 60</mark>"],
  function speed(mps) {
    return this.plan(function(j, elem) {
      this.css('turtleSpeed', mps);
    });
  }),
  wear: wraphelp(
  ["<u>wear(color)</u> Sets the turtle shell color: " +
      "<mark>wear turquoise</mark>",
      // Deal with "tan" and "fill".
   "<u>wear(url)</u> Sets the turtle image url: " +
      "<mark>wear 'http://bit.ly/1bgrQ0p'</mark>"],
  function wear(name) {
    var img = nameToImg(name);
    if (!img) return this;
    return this.plan(function(j, elem) {
      // Bug workaround - if backgroudnImg isn't cleared early enough,
      // the turtle image doesn't update.  (Even though this is done
      // later in applyImg.)
      this.css({
        backgroundImage: 'none',
      });
      // Keep the position of the origin unchanged even if the image resizes.
      watchImageToFixOriginOnLoad(elem, true);
      applyImg(this, img);
      queueWaitForImageLoad(this);
      fixOriginIfWatching(elem);
    });
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
    // Used to reload images to cycle animated gifs.
    return this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) {
        window.location.reload();
        return;
      }
      if (elem.src) {
        var src = elem.src;
        elem.src = '';
        elem.src = src;
      }
    });
  },
  hatch: wraphelp(
  ["<u>hatch(count, color)</u> Hatches any number of new turtles. Optional " +
      "color name. <mark>g = hatch 5; g.plan -> this.fd random 500</mark>"],
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
  }),
  pagexy: wraphelp(
  ["<u>pagexy()</u> Page coordinates {pageX:, pageY}, top-left based: " +
      "<mark>c = pagexy(); fd 500; moveto c</mark>"],
  function pagexy() {
    if (!this.length) return;
    fixOriginIfWatching(this[0]);
    return getCenterInPageCoordinates(this[0]);
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
    return this.plan(function(j, elem) {
      var c = $.map($.css(elem, 'turtleScale').split(' '), parseFloat);
      if (c.length === 1) { c.push(c[0]); }
      if ((c[0] * c[1] < 0) === (!val)) {
        c[0] = -c[0];
        this.css('turtleScale', c.join(' '));
      }
    });
  },
  twist: wraphelp(
  ["<u>twist(degrees)</u> Set the primary direction of the turtle. Allows " +
      "use of images that face a different direction than 'up': " +
      "<mark>twist(90)</mark>"],
  function twist(val) {
    if (val === undefined) {
      return parseFloat(this.css('turtleTwist'));
    }
    return this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      this.css('turtleTwist', val);
    });
  }),
  scale: wraphelp(
  ["<u>scale(factor)</u> Scales all motion up or down by a factor. " +
      "To double all drawing: <mark>scale(2)</mark>"],
  function scale(valx, valy) {
    if (valy === undefined) { valy = valx; }
    // Disallow scaling to zero using this method.
    if (!valx || !valy) { return this; }
    return this.plan(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      var c = $.map($.css(elem, 'turtleScale').split(' '), parseFloat);
      if (c.length === 1) { c.push(c[0]); }
      c[0] *= valx;
      c[1] *= valy;
      this.css('turtleScale', $.map(c, cssNum).join(' '));
    });
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
        fixOriginIfWatching(this[j]);
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
    function enqueue(elem, index) {
       var animation = (function() {
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
            $.dequeue(elem, qname);
          }),
          action = animation.finish = (args ?
          (function() { callback.apply($(elem), args); }) :
          (function() { callback.call($(elem), index, elem); }));
      $.queue(elem, qname, animation);
    }
    var elem, sel, length = this.length, j = 0;
    for (; j < length; ++j) {
      elem = this[j];
      // Queue an animation if there is a queue.
      if ($.queue(elem, qname).length) {
        enqueue(elem, j);
      } else if (args) {
        callback.apply($(elem), args);
      } else {
        callback.call($(elem), j, elem);
      }
    }
    return this;
  }),
  loadscript: wraphelp(
  ["<u>loadscript(url, callback)</u> Loads Javascript or Coffeescript from " +
       "the given URL, calling callback when done."],
  function loadscript(url, callback) {
    if (window.CoffeeScript && /\.(?:coffee|cs)$/.test(url)) {
      CoffeeScript.load(url, callback);
    } else {
      $.getScript(url, callback);
    }
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

var turtleGIFUrl = "data:image/gif;base64,R0lGODlhKAAwAPEDAAFsOACSRTCuSAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJZAADACwAAAAAKAAwAAACzpyPqcvtByJ49EWBRaw8gZxNXfeB4ciVpoZWqim2zhfUNivP9h7EOQPg9VqSDVDocwUyQ8UFlrS8mobIciXoRRtBULGLBWm/EudVHA6fxVFw+v2mQtbwundhteuz2yp9z/cVMAPIhvIC2EdYiKHIxdhIBIkzgrjnCDSJiacpCbnp1HkoWklKYqo0KUfhxjhWBmQ5ibFaJTsbGYob1nb2+kdbVLNS++Lz5JVEBguhEmQW/GOcSUl09sxZffj1qP2zCPo9QBMuXVMubSS+/lAAACH5BAVkAAMALAEAAQAmAC4AAALNnI9pwKAP4wKiCiZzpLY6DR5c54XhSH5mhnbqugnBTF8wS+fBez+AvuvhdDxEA3NqXYqDnyXIcpIqu5fU8zlqr9OntgPlPrtk2TQcKKvXMpWSDYcu0vB6NVE90uskOY6fsvIGxxQDaFEIMciW6HOIKPhYYrK41qhQqXaZkFm2aSRpQxn6KUIaKVnatHfoZ6TF2sokFopY1PmIZFrryRkrk0dLpef1usXDMKXb5CIk5TqwY+s8idncw1EoPYxdjanVLSqk4aTqPGOOvaxRAAA7";

var eventfn = { click:1, mouseup:1, mousedown:1, mousemove:1,
    keydown:1, keypress:1, keyup:1 };

var global_turtle = null;
var global_turtle_methods = [];
var attaching_ids = false;
var dollar_turtle_methods = {
  cs: wraphelp(
  ["<u>cs()</u> Clear screen. Erases both graphics canvas and " +
      "body text: <mark>do cs</mark>"],
  function cs() { planIfGlobal(function() { clearField() }); }),
  cg: wraphelp(
  ["<u>cg()</u> Clear graphics. Does not alter body text: " +
      "<mark>do cg</mark>"],
  function cg() { planIfGlobal(function() {clearField('canvas turtles') });}),
  ct: wraphelp(
  ["<u>ct()</u> Clear text. Does not alter graphics canvas: " +
      "<mark>do ct</mark>"],
  function ct() { planIfGlobal(function() { clearField('text') }); }),
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
    planIfGlobal(function() { globaldefaultspeed(mps); });
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
      playABC(null, arguments);
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
  write: wraphelp(
  ["<u>write(html)</u> Writes text output. Arbitrary HTML may be written: " +
      "<mark>write 'Hello, world!'</mark>"],
  function write(html) { return output(html, 'div'); }),
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
  hatch: wraphelp(
  ["<u>hatch(count, color)</u> Hatches any number of new turtles. Optional " +
      "color name. <mark>g = hatch 5; g.plan -> this.fd random 500</mark>"],
  function hatch(count, spec) {
    return $(document).hatch(count, spec);
  }),
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
  if (!options.hasOwnProperty('htmlscript') || options.htmlscript) {
    $('script[type="text/html"]').each(function() {
        $(this).replaceWith(
            $(this).html().replace(/^\x3c!\[CDATA\[\n?|\]\]\x3e$/g, ''));
    });
  }
  if (!drawing.ctx && options.hasOwnProperty('subpixel')) {
    drawing.subpixel = parseInt(options.subpixel);
  }
  // Set up global events.
  if (!options.hasOwnProperty('events') || options.events) {
    turtleevents(options.eventprefix);
  }
  // Set up global log function.
  if (!options.hasOwnProperty('see') || options.see) {
    exportsee();
    exportedsee = true;
    if (window.addEventListener) {
      window.addEventListener('error', see);
    } else {
      window.onerror = see;
    }
  }
  // Copy $.turtle.* functions into global namespace.
  if (!options.hasOwnProperty('functions') || options.functions) {
    $.extend(window, dollar_turtle_methods);
  }
  // Set default turtle speed
  globaldefaultspeed(options.hasOwnProperty('defaultspeed') ?
      options.defaultspeed : 1);
  // Initialize audio context (avoids delay in first notes).
  try {
    getAudioTop();
  } catch (e) { }
  // Find or create a singleton turtle if one does not exist.
  var selector = null;
  if (id) {
    selector = $('#' + id);
    if (!selector.length) {
      selector = dollar_turtle_methods.hatch(id);
    }
  }
  if (selector && !selector.length) { selector = null; }
  // Globalize selected jQuery methods of a singleton turtle.
  if (selector && selector.length === 1 &&
      (!options.hasOwnProperty('global') || options.global)) {
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
  if (!options.hasOwnProperty('ids') || options.ids) {
    turtleids(options.idprefix);
  }
  // Set up test console.
  if (!options.hasOwnProperty('panel') || options.panel) {
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
      opacity: 0.5,
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
    queueWaitForImageLoad(result);
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
  return !!(window.audioContext || window.webkitAudioContext);
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
function playABC(elem, args) {
  if (!isAudioPresent()) {
    if (elem) { $(elem).dequeue(); }
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
        g = atop.ac.createGainNode();
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
            o.noteOn(time);
            o.noteOff(rtime);
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
      $(elem).dequeue();
    }
  }
  if (elem) {
    callDequeueWhenDone();
  }
}


//////////////////////////////////////////////////////////////////////////
// SEE LOGGING SUPPORT
// A copy of see.js here.
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
var panel = (window.self !== window.top);  // show panel by default if framed.
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
  if (options.hasOwnProperty('jQuery')) { $ = options.jQuery; }
  if (options.hasOwnProperty('eval')) { scopes[''].e = options['eval']; }
  if (options.hasOwnProperty('this')) { scopes[''].t = options['this']; }
  if (options.hasOwnProperty('element')) { logelement = options.element; }
  if (options.hasOwnProperty('autoscroll')) { autoscroll = options.autoscroll; }
  if (options.hasOwnProperty('linestyle')) { linestyle = options.linestyle; }
  if (options.hasOwnProperty('depth')) { logdepth = options.depth; }
  if (options.hasOwnProperty('panel')) { panel = options.panel; }
  if (options.hasOwnProperty('height')) { panelheight = options.height; }
  if (options.hasOwnProperty('title')) { paneltitle = options.title; }
  if (options.hasOwnProperty('console')) { logconsole = options.console; }
  if (options.hasOwnProperty('history')) { uselocalstorage = options.history; }
  if (options.hasOwnProperty('coffee')) { coffeescript = options.coffee; }
  if (options.hasOwnProperty('abbreviate')) { abbreviate = options.abbreviate; }
  if (options.hasOwnProperty('consolehook')) { consolehook = options.consolehook; }
  if (options.hasOwnProperty('noconflict')) { noconflict(options.noconflict); }
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
    var identical = (obj.length > 1);
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
    while ((child = temp.firstChild)) {
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
