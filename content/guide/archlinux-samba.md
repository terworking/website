---
author: Yasser
created: 2022-06-20T06:21:27.884Z
description: Instalasi dan konfigurasi Samba file server di Archlinux.
modified: 2022-06-20T06:21:27.884Z
---

# Instalasi Samba File Server di Archlinux

> [Samba](https://www.samba.org/) is the standard Windows interoperability suite of programs for Linux and Unix. Since 1992, Samba has provided secure, stable and fast file and print services for all clients using the SMB/CIFS protocol, such as all versions of DOS and Windows, OS/2, Linux and many others.

## Instalasi `samba`

Install _package_ `samba` .

```bash
sudo pacman -S samba
```

## Konfigurasi `samba`

`samba` dikonfigurasi melalui file `/etc/samba/smb.conf`, file tersebut tidak langsung ada setelah proses instalasi, jadi harus dibuat dulu.

```bash
sudo touch /etc/samba/smb.conf
```

> Kalian juga bisa mendownload _sample_ file konfigurasi samba di [_repository git_ `samba`](https://git.samba.org/samba.git/?p=samba.git;a=blob_plain;f=examples/smb.conf.default;hb=HEAD).

Konfigurasi yang akan saya contohkan disini hanya konfigurasi simpel saja.

1. satu folder publik (read-only) dan
2. satu folder perlu login (read-write).

### Konfigurasi folder publik

Buat _user_ yang akan digunakan oleh folder publik.

```bash
sudo useradd guest --shell /bin/nologin
```

Beri akses untuk membaca isi folder yang ingin dishare kepada _user_ tersebut, misalnya saya disini ingin share folder `~/Videos`.

```bash
# beri akses user `guest`
setfacl --recursive --modify user:guest:r-x ~/Videos
# jalankan juga command berikut jika kalian share folder yang berada di home (diawali ~)
setfacl --modify user:guest:--x ~
```

Tambah konfigurasi berikut di file konfigurasi kalian. Perhatikan, disini ubah _path_ folder yang ingin kalian share menjadi _path_ absolut (jangan pakai ~).

```bash
# dapatkan path absolut
realpath ~/Videos
> /home/yasser/Videos
```

```conf
[global]
security = user
map to guest = bad user
guest account = guest

# ubah `publik` menjadi nama folder yang kalian inginkan
[publik]
  # comment ini akan muncul ketika kalian hover folder samba ini di Windows
  comment = Folder publik
  # ubah `/home/yasser/Videos` menjadi path absolut folder yang ingin kalian share
  path = /home/yasser/Videos
  public = yes
  writable = no
```

### Konfigurasi folder perlu login

Pertama buat user yang ingin kalian gunakan untuk login, jika kalian ingin menggunakan user yang kalian gunakan satu tahapan ini bisa dilewati.

```
useradd yarres --shell /bin/nologin
```

Tambah juga _user samba_.

```
sudo smbpasswd -a yarres
```

Beri akses kepada user tersebut, sama seperti tadi tetapi beri juga akses _write_. Disini saya ingin share folder `~/Documents`.

```bash
# beri akses user `yarres`
setfacl --recursive --modify user:yarres:rwx ~/Documents
# jalankan juga command berikut jika kalian share folder yang berada di home (diawali ~)
setfacl --modify user:yarres:--x ~
```

Tambahkan konfigurasi berikut ke file konfigurasi `samba`, ubah juga pathnya menjadi absolut bila belum.

```bash
# dapatkan path absolut
realpath ~/Documents
> /home/yasser/Documents
```

```conf
# ubah `perlu login` menjadi nama folder yang kalian inginkan
[perlu login]
  comment = Folder perlu login
  # ubah `/home/yasser/Documents` menjadi path absolut folder yang ingin kalian share
  path = /home/yasser/Documents
  writable = yes
```

## Jalankan `samba`

_Test syntax_ file konfigurasi `samba` terlebih dahulu.

```bash
testparm -s

```

Untuk menjalankan `samba`, gunakan `systemctl`.

```bash
sudo systemctl start smb
# jika kalian juga ingin `samba` jalan otomatis jalan setelah `boot`
sudo systemctl enable --now smb
```

## Ujicoba konfigurasi

Kita akan menguji konfigurasi `samba` menggunakan `smbclient`. Install _package_ `smbclient` terlebih dahulu.

```bash
sudo pacman -S smbclient
```

### Ujicoba konfigurasi folder publik

```
smbclient "//localhost/publik" --no-pass
```

Jika kalian bisa masuk, jalankan _command_ berikut:

- `ls`
- `put .bashrc`. _Command_ untuk ujicoba _read-only_, ini harus _error_.

Kalau hasilnya tepat, berarti konfigurasinya sudah benar. Klik <kbd>CTRL+D</kbd> untuk keluar.

### Ujicoba konfigurasi perlu login

```
smbclient --user=yarres "//localhost/perlu login"
```

Masukkan _password_ jika diminta. Lalu jalankan _command_ berikut:

- `ls`
- `put .bashrc`

Kalau tidak ada _error_, berarti konfigurasinya sudah benar. Klik <kbd>CTRL+D</kbd> untuk keluar.
