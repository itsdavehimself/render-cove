import { Schema } from 'mongoose';

interface Hardware {
  cpu: string;
  gpu: string;
  ram: string;
}

export default Hardware;
