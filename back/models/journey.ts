import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { sequelize } from '../util/db.js';
import Station from './station.js';

class Journey extends Model<InferAttributes<Journey>, InferCreationAttributes<Journey>> {
  declare id: CreationOptional<number>;

  declare departureTime: Date;

  declare returnTime: Date;

  declare departureStationId: ForeignKey<Station['id']>;

  declare returnStationId: ForeignKey<Station['id']>;

  declare distance: number;

  declare duration: number;

  declare departureStation: NonAttribute<Station>;

  declare returnStation: NonAttribute<Station>;
}

Journey.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returnTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    departureStationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    returnStationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'journey'
  }
);

export default Journey;
