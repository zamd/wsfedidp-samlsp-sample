var express = require('express');
var router = express.Router();
var passport = require('passport');
var wsfed = require('wsfed');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const wsfedOptions = {
  issuer: 'samplests.example.com',
  getPostURL: function (wtrealm, wreply, req, cb) {
    return cb(null, "https://samplests.example.com/login/callback");
  },

  cert: `-----BEGIN CERTIFICATE-----
MIIFSjCCBDKgAwIBAgISAyurF/JOd7nxgOLOuVbLf0vSMA0GCSqGSIb3DQEBCwUA
MEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MSMwIQYDVQQD
ExpMZXQncyBFbmNyeXB0IEF1dGhvcml0eSBYMzAeFw0xNzAzMjAwNTA5MDBaFw0x
NzA2MTgwNTA5MDBaMB8xHTAbBgNVBAMTFG1hbmFnZS5zZXJ2ZXBpY3MuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAruspOKDTWRWi+aTKq9j4Gi6o
1yQBIs7hJLRsMGwPlDlRdpQMDGVexmdQouJlFfw3QL/jlPxEFCCaGdM2zhoaBxMP
tnwLAaLvtTsT8OlyCxI5b2ChjJLsrX+Gl/joa0d4mDIW5u9QIzn1ByLB4j4Wvy6D
T+5ukyMrOTr4MzU426tadpBXcFwHfMhwRVZ/Gbx5QZa918ctnvFI6KsbsatQqcvH
kNlNJOGWxqJ7+7+ur1DyCecgd/lBYAjPC1mQ0TzI6XrMsluEKYMzcBBr90PhrGoF
YAFazYSzTON5DP1HGb4eKzl/j7/XcfjcLlvDvX2bbYFgskstrBRqtb8K90NnowID
AQABo4ICUzCCAk8wDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMB
BggrBgEFBQcDAjAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBRQK1qqv2opcsi9SVde
zBSoASfWVzAfBgNVHSMEGDAWgBSoSmpjBH3duubRObemRWXv86jsoTBwBggrBgEF
BQcBAQRkMGIwLwYIKwYBBQUHMAGGI2h0dHA6Ly9vY3NwLmludC14My5sZXRzZW5j
cnlwdC5vcmcvMC8GCCsGAQUFBzAChiNodHRwOi8vY2VydC5pbnQteDMubGV0c2Vu
Y3J5cHQub3JnLzBdBgNVHREEVjBUghJhdXRoLnNlcnZlcGljcy5jb22CFG1hbmFn
ZS5zZXJ2ZXBpY3MuY29tghFydGEuc2VydmVwaWNzLmNvbYIVd2VidGFzay5zZXJ2
ZXBpY3MuY29tMIH+BgNVHSAEgfYwgfMwCAYGZ4EMAQIBMIHmBgsrBgEEAYLfEwEB
ATCB1jAmBggrBgEFBQcCARYaaHR0cDovL2Nwcy5sZXRzZW5jcnlwdC5vcmcwgasG
CCsGAQUFBwICMIGeDIGbVGhpcyBDZXJ0aWZpY2F0ZSBtYXkgb25seSBiZSByZWxp
ZWQgdXBvbiBieSBSZWx5aW5nIFBhcnRpZXMgYW5kIG9ubHkgaW4gYWNjb3JkYW5j
ZSB3aXRoIHRoZSBDZXJ0aWZpY2F0ZSBQb2xpY3kgZm91bmQgYXQgaHR0cHM6Ly9s
ZXRzZW5jcnlwdC5vcmcvcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQELBQADggEBADmW
sSocFNPdiXoOjmKkNcAzElcNzZDuUReImKXuKqqMopv6KeMLDBoKA1SEfQBbqqlK
Tb5UzbZ7eB9e7/8XxSsbkx/AdkWRHAJ6oOP1rH+eGGH6uuqk9aerbOz1NWoyecJl
G8C647rI8reW8WHrv1fk2WzjghWIynySu3dX3CY89w6bh0+krwG4D4lXXAO63jTj
miOGYYMm8jd0VkumCBtGKOU//xAG7QPm+wRerzaZnJWunv/v9Xn8aeox6nZt50js
cSvpI3soitj3IqMN+Ioxl29V4lpL4Ydt1X0hUXrfclkuRK7ejkN2lynflM5dMLhy
dZff985htggS1OtqcqU=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/
MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
DkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow
SjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT
GkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF
q6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8
SMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0
Z8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA
a6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj
/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T
AQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG
CCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv
bTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k
c3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw
VAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC
ARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz
MDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu
Y3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF
AAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo
uM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/
wApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu
X4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG
PfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6
KOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==
-----END CERTIFICATE-----`,
  key: `{REMOVED}`,
};


router.get('/FederationMetadata/2007-06/FederationMetadata.xml', wsfed.metadata(wsfedOptions));
router.get('/', ensureLoggedIn('/login'), wsfed.auth(wsfedOptions));

module.exports = router;
