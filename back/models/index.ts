import Journey from './journey.js';
import Station from './station.js';
import User from './user.js';

const sync = async () => {
  await Station.sync();
  Journey.sync();
  User.sync();
};

sync();

Journey.belongsTo(Station, { foreignKey: 'departureStationId', as: 'departureStation' });
Journey.belongsTo(Station, { foreignKey: 'returnStationId', as: 'returnStation' });

Station.hasMany(Journey, { foreignKey: 'departureStationId', as: 'journeysFrom' });
Station.hasMany(Journey, { foreignKey: 'returnStationId', as: 'journeysTo' });

export { Journey, Station };
