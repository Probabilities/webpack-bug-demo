import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');
const combo = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM users', (err, row) => {
        if (err) {
            console.log('error getting user', err);
            reject();
        }

        resolve(`${row.email}:${row.password}`);
    });
});

console.log({ combo })

const [email, password] = combo.split(':')

const server = {
    host: 'imap.gmail.com',
    port: 993
}

const imap = new Imap({
    user: email,
    password,
    host: server.host,
    port: server.port,
    tls: true
})

imap.once('ready', () => {
    console.log('Logged in')

    imap.getBoxes((err, boxes) => {
        if (err) {
            console.log('error getting boxes', email)
        }

        console.log(`Inboxes for ${email}:`, Object.keys(boxes))
    })

    resolve()
})

imap.once('error', (err) => {
    console.log('error', email, err)
})

imap.connect()
imap.once('ready', () => {
    console.log('Logged in');

    imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;

        const fetch = imap.seq.fetch('1:10', {
            bodies: '',
            struct: true
        });

        fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream, info) => {
                simpleParser(stream, (err, mail) => {
                    if (err) {
                        console.log('error parsing email', err);
                    } else {
                        console.log('Parsed email:', mail);
                    }
                });
            });
        });

        fetch.once('error', (err) => {
            console.log('Fetch error:', err);
        });

        fetch.once('end', () => {
            console.log('Done fetching all messages!');
            imap.end();
        });
    });
});