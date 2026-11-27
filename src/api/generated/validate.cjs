/* Generated from banking-core-api@fc06aebdc53ae2e4a28e54aaeb875294e317e8c1. Run npm run contract:generate. */
"use strict";
exports.isId = validate35;
const schema48 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Id"};
const schema34 = {"type":"string","format":"uuid"};
const formats0 = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function validate35(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate35.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(errors === _errs0){
if(errors === _errs0){
if(typeof data === "string"){
if(!(formats0.test(data))){
validate35.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate35.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
validate35.errors = vErrors;
return errors === 0;
}
validate35.evaluated = {"dynamicProps":false,"dynamicItems":false};

exports.isAccountLimit = validate36;
const schema50 = {"$ref":"urn:tiwalo:banking-v1#/paths/~1accounts/get/parameters/0/schema"};
const schema51 = {"type":"integer","minimum":1,"maximum":100,"default":20};

function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate36.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(!((typeof data == "number") && (!(data % 1) && !isNaN(data)))){
validate36.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1accounts/get/parameters/0/schema/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs0){
if(typeof data == "number"){
if(data > 100 || isNaN(data)){
validate36.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1accounts/get/parameters/0/schema/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data < 1 || isNaN(data)){
validate36.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1accounts/get/parameters/0/schema/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
validate36.errors = vErrors;
return errors === 0;
}
validate36.evaluated = {"dynamicProps":false,"dynamicItems":false};

exports.isCursor = validate37;
const schema52 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Cursor"};
const schema53 = {"type":"string","minLength":1,"maxLength":512};
const func1 = require("ajv/dist/runtime/ucs2length").default;

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(errors === _errs0){
if(typeof data === "string"){
if(func1(data) > 512){
validate37.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Cursor/maxLength",keyword:"maxLength",params:{limit: 512},message:"must NOT have more than 512 characters"}];
return false;
}
else {
if(func1(data) < 1){
validate37.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Cursor/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate37.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Cursor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"dynamicProps":false,"dynamicItems":false};

exports.isAccountPage = validate38;
const schema54 = {"$ref":"urn:tiwalo:banking-v1#/paths/~1accounts/get/responses/200/content/application~1json/schema"};
const schema55 = {"type":"object","required":["accounts"],"properties":{"accounts":{"type":"array","maxItems":100,"items":{"$ref":"#/components/schemas/Account"}},"nextCursor":{"$ref":"#/components/schemas/Cursor"}}};
const schema56 = {"type":"object","required":["accountId","recipientReference","status","currency","availableBalanceMinor"],"properties":{"accountId":{"$ref":"#/components/schemas/Id"},"recipientReference":{"$ref":"#/components/schemas/RecipientReference"},"status":{"type":"string","enum":["ACTIVE","FROZEN","CLOSED"]},"currency":{"$ref":"#/components/schemas/Currency"},"availableBalanceMinor":{"$ref":"#/components/schemas/MinorUnits"}}};
const schema35 = {"type":"string","minLength":1,"maxLength":128,"description":"Opaque, case-sensitive payment address. Clients preserve it verbatim."};
const schema36 = {"type":"string","enum":["PHP"]};
const schema38 = {"type":"string","minLength":1,"maxLength":19,"pattern":"^(0|[1-9][0-9]*)$","description":"Nonnegative centavos up to 9223372036854775807 inclusive.","anyOf":[{"maxLength":18},{"pattern":"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"}]};
const pattern4 = new RegExp("^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])", "u");
const pattern5 = new RegExp("^(0|[1-9][0-9]*)$", "u");

function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate40.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.accountId === undefined) && (missing0 = "accountId")) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.availableBalanceMinor === undefined) && (missing0 = "availableBalanceMinor"))){
validate40.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.accountId !== undefined){
let data0 = data.accountId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate40.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate40.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data1 = data.recipientReference;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate40.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate40.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate40.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs7 = errors;
if(typeof data2 !== "string"){
validate40.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "ACTIVE") || (data2 === "FROZEN")) || (data2 === "CLOSED"))){
validate40.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema56.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data3 = data.currency;
const _errs9 = errors;
if(typeof data3 !== "string"){
validate40.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data3 === "PHP")){
validate40.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema36.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availableBalanceMinor !== undefined){
let data4 = data.availableBalanceMinor;
const _errs12 = errors;
const _errs13 = errors;
const _errs15 = errors;
let valid5 = false;
const _errs16 = errors;
if(typeof data4 === "string"){
if(func1(data4) > 18){
const err0 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 18},message:"must NOT have more than 18 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs16 === errors;
valid5 = valid5 || _valid0;
const _errs17 = errors;
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err1 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"},message:"must match pattern \""+"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs17 === errors;
valid5 = valid5 || _valid0;
if(!valid5){
const err2 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate40.errors = vErrors;
return false;
}
else {
errors = _errs15;
if(vErrors !== null){
if(_errs15){
vErrors.length = _errs15;
}
else {
vErrors = null;
}
}
}
if(errors === _errs13){
if(typeof data4 === "string"){
if(func1(data4) > 19){
validate40.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/maxLength",keyword:"maxLength",params:{limit: 19},message:"must NOT have more than 19 characters"}];
return false;
}
else {
if(func1(data4) < 1){
validate40.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern5.test(data4)){
validate40.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|[1-9][0-9]*)$"+"\""}];
return false;
}
}
}
}
else {
validate40.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate40.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate40.errors = vErrors;
return errors === 0;
}
validate40.evaluated = {"props":{"accountId":true,"recipientReference":true,"status":true,"currency":true,"availableBalanceMinor":true},"dynamicProps":false,"dynamicItems":false};


function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate39.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.accounts === undefined) && (missing0 = "accounts")){
validate39.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.accounts !== undefined){
let data0 = data.accounts;
const _errs1 = errors;
if(errors === _errs1){
if(Array.isArray(data0)){
if(data0.length > 100){
validate39.errors = [{instancePath:instancePath+"/accounts",schemaPath:"#/properties/accounts/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
const _errs3 = errors;
if(!(validate40(data0[i0], {instancePath:instancePath+"/accounts/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
var valid1 = _errs3 === errors;
if(!valid1){
break;
}
}
}
}
else {
validate39.errors = [{instancePath:instancePath+"/accounts",schemaPath:"#/properties/accounts/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nextCursor !== undefined){
let data2 = data.nextCursor;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(func1(data2) > 512){
validate39.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/Cursor/maxLength",keyword:"maxLength",params:{limit: 512},message:"must NOT have more than 512 characters"}];
return false;
}
else {
if(func1(data2) < 1){
validate39.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/Cursor/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate39.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/Cursor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
else {
validate39.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate39.errors = vErrors;
return errors === 0;
}
validate39.evaluated = {"props":{"accounts":true,"nextCursor":true},"dynamicProps":false,"dynamicItems":false};


function validate38(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate38.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate39(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
errors = vErrors.length;
}
validate38.errors = vErrors;
return errors === 0;
}
validate38.evaluated = {"props":{"accounts":true,"nextCursor":true},"dynamicProps":false,"dynamicItems":false};

exports.isAccount = validate43;
const schema62 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Account"};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate44.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.accountId === undefined) && (missing0 = "accountId")) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.availableBalanceMinor === undefined) && (missing0 = "availableBalanceMinor"))){
validate44.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.accountId !== undefined){
let data0 = data.accountId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate44.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate44.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data1 = data.recipientReference;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate44.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate44.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate44.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs7 = errors;
if(typeof data2 !== "string"){
validate44.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "ACTIVE") || (data2 === "FROZEN")) || (data2 === "CLOSED"))){
validate44.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema56.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data3 = data.currency;
const _errs9 = errors;
if(typeof data3 !== "string"){
validate44.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data3 === "PHP")){
validate44.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema36.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availableBalanceMinor !== undefined){
let data4 = data.availableBalanceMinor;
const _errs12 = errors;
const _errs13 = errors;
const _errs15 = errors;
let valid5 = false;
const _errs16 = errors;
if(typeof data4 === "string"){
if(func1(data4) > 18){
const err0 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 18},message:"must NOT have more than 18 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs16 === errors;
valid5 = valid5 || _valid0;
const _errs17 = errors;
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err1 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"},message:"must match pattern \""+"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs17 === errors;
valid5 = valid5 || _valid0;
if(!valid5){
const err2 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate44.errors = vErrors;
return false;
}
else {
errors = _errs15;
if(vErrors !== null){
if(_errs15){
vErrors.length = _errs15;
}
else {
vErrors = null;
}
}
}
if(errors === _errs13){
if(typeof data4 === "string"){
if(func1(data4) > 19){
validate44.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/maxLength",keyword:"maxLength",params:{limit: 19},message:"must NOT have more than 19 characters"}];
return false;
}
else {
if(func1(data4) < 1){
validate44.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern5.test(data4)){
validate44.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|[1-9][0-9]*)$"+"\""}];
return false;
}
}
}
}
else {
validate44.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate44.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate44.errors = vErrors;
return errors === 0;
}
validate44.evaluated = {"props":{"accountId":true,"recipientReference":true,"status":true,"currency":true,"availableBalanceMinor":true},"dynamicProps":false,"dynamicItems":false};


function validate43(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate43.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate44(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate44.errors : vErrors.concat(validate44.errors);
errors = vErrors.length;
}
validate43.errors = vErrors;
return errors === 0;
}
validate43.evaluated = {"props":{"accountId":true,"recipientReference":true,"status":true,"currency":true,"availableBalanceMinor":true},"dynamicProps":false,"dynamicItems":false};

exports.isTransferReceipt = validate46;
const schema68 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/TransferReceipt"};
const schema69 = {"type":"object","required":["transferId","sourceAccountId","recipientReference","currency","amountMinor","status","postedAt"],"properties":{"transferId":{"$ref":"#/components/schemas/Id"},"sourceAccountId":{"$ref":"#/components/schemas/Id"},"recipientReference":{"$ref":"#/components/schemas/RecipientReference"},"currency":{"$ref":"#/components/schemas/Currency"},"amountMinor":{"$ref":"#/components/schemas/TransferAmountMinor"},"status":{"type":"string","enum":["POSTED"]},"postedAt":{"type":"string","format":"date-time"}}};
const formats24 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const schema37 = {"allOf":[{"$ref":"#/components/schemas/MinorUnits"},{"type":"string","pattern":"^[1-9]"}],"description":"Positive centavos up to 9223372036854775807 inclusive. Out-of-range values are invalid requests."};
const pattern6 = new RegExp("^[1-9]", "u");

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
const _errs1 = errors;
const _errs3 = errors;
let valid2 = false;
const _errs4 = errors;
if(typeof data === "string"){
if(func1(data) > 18){
const err0 = {instancePath,schemaPath:"#/components/schemas/MinorUnits/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 18},message:"must NOT have more than 18 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs4 === errors;
valid2 = valid2 || _valid0;
const _errs5 = errors;
if(typeof data === "string"){
if(!pattern4.test(data)){
const err1 = {instancePath,schemaPath:"#/components/schemas/MinorUnits/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"},message:"must match pattern \""+"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const err2 = {instancePath,schemaPath:"#/components/schemas/MinorUnits/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate23.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
if(errors === _errs1){
if(typeof data === "string"){
if(func1(data) > 19){
validate23.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/maxLength",keyword:"maxLength",params:{limit: 19},message:"must NOT have more than 19 characters"}];
return false;
}
else {
if(func1(data) < 1){
validate23.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern5.test(data)){
validate23.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|[1-9][0-9]*)$"+"\""}];
return false;
}
}
}
}
else {
validate23.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs0 === errors;
if(valid0){
const _errs6 = errors;
if(errors === _errs6){
if(typeof data === "string"){
if(!pattern6.test(data)){
validate23.errors = [{instancePath,schemaPath:"#/allOf/1/pattern",keyword:"pattern",params:{pattern: "^[1-9]"},message:"must match pattern \""+"^[1-9]"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"dynamicProps":false,"dynamicItems":false};


function validate47(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate47.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.transferId === undefined) && (missing0 = "transferId")) || ((data.sourceAccountId === undefined) && (missing0 = "sourceAccountId"))) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.amountMinor === undefined) && (missing0 = "amountMinor"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.postedAt === undefined) && (missing0 = "postedAt"))){
validate47.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.transferId !== undefined){
let data0 = data.transferId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate47.errors = [{instancePath:instancePath+"/transferId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate47.errors = [{instancePath:instancePath+"/transferId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sourceAccountId !== undefined){
let data1 = data.sourceAccountId;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(errors === _errs5){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate47.errors = [{instancePath:instancePath+"/sourceAccountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate47.errors = [{instancePath:instancePath+"/sourceAccountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data2 = data.recipientReference;
const _errs7 = errors;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data2 === "string"){
if(func1(data2) > 128){
validate47.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data2) < 1){
validate47.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate47.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data3 = data.currency;
const _errs10 = errors;
if(typeof data3 !== "string"){
validate47.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data3 === "PHP")){
validate47.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema36.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.amountMinor !== undefined){
const _errs13 = errors;
if(!(validate23(data.amountMinor, {instancePath:instancePath+"/amountMinor",parentData:data,parentDataProperty:"amountMinor",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data5 = data.status;
const _errs14 = errors;
if(typeof data5 !== "string"){
validate47.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data5 === "POSTED")){
validate47.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema69.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postedAt !== undefined){
let data6 = data.postedAt;
const _errs16 = errors;
if(errors === _errs16){
if(errors === _errs16){
if(typeof data6 === "string"){
if(!(formats24.validate(data6))){
validate47.errors = [{instancePath:instancePath+"/postedAt",schemaPath:"#/properties/postedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate47.errors = [{instancePath:instancePath+"/postedAt",schemaPath:"#/properties/postedAt/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate47.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate47.errors = vErrors;
return errors === 0;
}
validate47.evaluated = {"props":{"transferId":true,"sourceAccountId":true,"recipientReference":true,"currency":true,"amountMinor":true,"status":true,"postedAt":true},"dynamicProps":false,"dynamicItems":false};


function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate46.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate47(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate47.errors : vErrors.concat(validate47.errors);
errors = vErrors.length;
}
validate46.errors = vErrors;
return errors === 0;
}
validate46.evaluated = {"props":{"transferId":true,"sourceAccountId":true,"recipientReference":true,"currency":true,"amountMinor":true,"status":true,"postedAt":true},"dynamicProps":false,"dynamicItems":false};

exports.isProblem = validate50;
const schema74 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Problem"};
const schema41 = {"type":"object","description":"RFC 9457 Problem Details. Branch on the stable code. User-facing text may change.","required":["type","title","status","code"],"properties":{"type":{"type":"string","format":"uri"},"title":{"type":"string"},"status":{"type":"integer","minimum":400,"maximum":599},"code":{"type":"string","pattern":"^[A-Z][A-Z0-9_]*$"},"detail":{"type":"string"},"instance":{"type":"string","format":"uri-reference"}}};
const formats2 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats4 = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const pattern7 = new RegExp("^[A-Z][A-Z0-9_]*$", "u");

function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate50.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(errors === _errs0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.code === undefined) && (missing0 = "code"))){
validate50.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.type !== undefined){
let data0 = data.type;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats2(data0))){
validate50.errors = [{instancePath:instancePath+"/type",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/type/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/type",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid1 = _errs2 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate50.errors = [{instancePath:instancePath+"/title",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.status !== undefined){
let data2 = data.status;
const _errs6 = errors;
if(!((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2)))){
validate50.errors = [{instancePath:instancePath+"/status",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/status/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if(typeof data2 == "number"){
if(data2 > 599 || isNaN(data2)){
validate50.errors = [{instancePath:instancePath+"/status",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/status/maximum",keyword:"maximum",params:{comparison: "<=", limit: 599},message:"must be <= 599"}];
return false;
}
else {
if(data2 < 400 || isNaN(data2)){
validate50.errors = [{instancePath:instancePath+"/status",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/status/minimum",keyword:"minimum",params:{comparison: ">=", limit: 400},message:"must be >= 400"}];
return false;
}
}
}
}
var valid1 = _errs6 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.code !== undefined){
let data3 = data.code;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern7.test(data3)){
validate50.errors = [{instancePath:instancePath+"/code",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/code/pattern",keyword:"pattern",params:{pattern: "^[A-Z][A-Z0-9_]*$"},message:"must match pattern \""+"^[A-Z][A-Z0-9_]*$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/code",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.detail !== undefined){
const _errs10 = errors;
if(typeof data.detail !== "string"){
validate50.errors = [{instancePath:instancePath+"/detail",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/detail/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs10 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.instance !== undefined){
let data5 = data.instance;
const _errs12 = errors;
if(errors === _errs12){
if(errors === _errs12){
if(typeof data5 === "string"){
if(!(formats4.test(data5))){
validate50.errors = [{instancePath:instancePath+"/instance",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/instance/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/instance",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/instance/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid1 = _errs12 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
else {
validate50.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate50.errors = vErrors;
return errors === 0;
}
validate50.evaluated = {"props":{"type":true,"title":true,"status":true,"code":true,"detail":true,"instance":true},"dynamicProps":false,"dynamicItems":false};

