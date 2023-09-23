CREATE TABLE device_option (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sn VARCHAR(64) NOT NULL,
  option ENUM('Stamp', 'OpStamp', 'ErrorDelay', 'Delay', 'TransTimes', 'TransInterval', 'TransFlag', 'TimeZone', 'Realtime', 'Encrypt') NOT NULL,
  value VARCHAR(64) NOT NULL,
  UNIQUE(sn, option)
);
INSERT INTO device_option SET sn = 'default', option = 'Stamp', value = '9999';
INSERT INTO device_option SET sn = 'default', option = 'OpStamp', value = '0';
INSERT INTO device_option SET sn = 'default', option = 'ErrorDelay', value = '60';
INSERT INTO device_option SET sn = 'default', option = 'Delay', value = '30';
INSERT INTO device_option SET sn = 'default', option = 'TransTimes', value = '00:00;14:05';
INSERT INTO device_option SET sn = 'default', option = 'TransInterval', value = '1';
INSERT INTO device_option SET sn = 'default', option = 'TransFlag', value = '1000000000';
INSERT INTO device_option SET sn = 'default', option = 'TimeZone', value = '7';
INSERT INTO device_option SET sn = 'default', option = 'Realtime', value = '1';
INSERT INTO device_option SET sn = 'default', option = 'Encrypt', value = '0';
