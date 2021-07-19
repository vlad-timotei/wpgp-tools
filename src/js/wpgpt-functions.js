const WPGPT_VERSION = '1.4';

function setLS( name, value ){
  localStorage.setItem( name, value );
}

function getLS( name ){
  return localStorage.getItem( name );
}

function delLS( name ){
  localStorage.removeItem( name );
}